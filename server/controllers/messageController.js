// =============================================
// server/controllers/messageController.js
// With delivery + read receipts
// =============================================

const Message      = require("../models/Message");
const Conversation = require("../models/Conversation");

// ── Helper: find or create conversation ──────
const findOrCreateConversation = async (userA, userAModel, userB, userBModel) => {
  let conversation = await Conversation.findOne({
    "participants.user": { $all: [userA, userB] },
  });
  if (!conversation) {
    conversation = await Conversation.create({
      participants: [
        { user: userA, userModel: userAModel },
        { user: userB, userModel: userBModel },
      ],
      unreadCount: { [userA]: 0, [userB]: 0 },
    });
  }
  return conversation;
};

// ── GET ALL CONVERSATIONS (sidebar) ──────────
const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      "participants.user": userId,
    })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    // Mark all messages as delivered for this user
    // (they're online — anything sent to them counts as delivered)
    await Message.updateMany(
      { receiver: userId, isDelivered: false },
      { isDelivered: true }
    );

    // Notify senders via socket that their messages were delivered
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    if (io && onlineUsers) {
      const deliveredMsgs = await Message.find(
        { receiver: userId, isDelivered: true, isReadByReceiver: false },
        "sender conversation"
      );
      // Group by sender and notify each
      const senderIds = [...new Set(deliveredMsgs.map(m => m.sender.toString()))];
      senderIds.forEach(senderId => {
        const socketId = onlineUsers.get(senderId);
        if (socketId) {
          io.to(socketId).emit("messages:delivered", { receiverId: userId });
        }
      });
    }

    const populated = await Promise.all(
      conversations.map(async (convo) => {
        const other = convo.participants.find(
          (p) => p.user.toString() !== userId
        );
        const OtherModel = require(`../models/${other.userModel}`);
        const otherUser  = await OtherModel.findById(other.user).select(
          "name email profilePhoto department"
        );
        const unread = convo.unreadCount?.get?.(userId) || 0;
        return {
          _id:       convo._id,
          updatedAt: convo.updatedAt,
          otherUser: { ...otherUser.toObject(), role: other.userModel.toLowerCase() },
          lastMessage: convo.lastMessage,
          unreadCount: unread,
        };
      })
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET MESSAGES IN A THREAD ─────────────────
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;

    const convo = await Conversation.findOne({
      _id: conversationId,
      "participants.user": userId,
    });
    if (!convo) return res.status(403).json({ message: "Access denied." });

    const messages = await Message.find({ conversation: conversationId })
      .populate("sender", "name profilePhoto")
      .sort({ createdAt: 1 });

    // Mark all received messages as READ and DELIVERED
    await Message.updateMany(
      { conversation: conversationId, receiver: userId, isReadByReceiver: false },
      { isReadByReceiver: true, isDelivered: true, isRead: true }
    );

    // Reset unread count
    convo.unreadCount.set(userId.toString(), 0);
    await convo.save();

    // Notify the sender via socket that messages were read
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    if (io && onlineUsers) {
      // Find the other participant (the sender)
      const other = convo.participants.find(p => p.user.toString() !== userId);
      if (other) {
        const senderSocketId = onlineUsers.get(other.user.toString());
        if (senderSocketId) {
          io.to(senderSocketId).emit("messages:read", {
            conversationId,
            readBy: userId,
          });
        }
      }
    }

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── SEND A MESSAGE ────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, body, subject } = req.body;
    const senderModel = req.user.role === "student" ? "Student" : "Faculty";
    const senderId    = req.user.id;

    const conversation = await findOrCreateConversation(
      senderId, senderModel, receiverId, receiverModel
    );

    // Check if receiver is currently online — if so, mark delivered immediately
    const onlineUsers = req.app.get("onlineUsers");
    const isReceiverOnline = onlineUsers?.has(receiverId.toString());

    const message = await Message.create({
      conversation:    conversation._id,
      sender:          senderId,
      senderModel,
      receiver:        receiverId,
      receiverModel,
      body,
      subject:         subject || "",
      isDelivered:     isReceiverOnline, // delivered immediately if online
      isReadByReceiver: false,
    });

    await message.populate("sender", "name profilePhoto");

    // Update conversation
    const currentUnread = conversation.unreadCount?.get?.(receiverId.toString()) || 0;
    conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
      message: "Message sent!",
      data: message,
      conversationId: conversation._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── OPEN / CREATE CONVERSATION ────────────────
const getOrCreateConversation = async (req, res) => {
  try {
    const { otherUserId, otherUserModel } = req.body;
    const senderModel = req.user.role === "student" ? "Student" : "Faculty";
    const conversation = await findOrCreateConversation(
      req.user.id, senderModel, otherUserId, otherUserModel
    );
    res.json({ conversationId: conversation._id });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── BACKWARDS COMPAT ─────────────────────────
const getInbox      = getConversations;

const replyToMessage = async (req, res) => {
  const parent = await Message.findById(req.params.messageId);
  if (!parent) return res.status(404).json({ message: "Message not found." });
  req.body.receiverId    = parent.sender;
  req.body.receiverModel = parent.senderModel;
  return sendMessage(req, res);
};

const markAsRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.messageId, {
      isRead: true, isReadByReceiver: true,
    });
    res.json({ message: "Marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  getConversations, getMessages, sendMessage,
  getOrCreateConversation, getInbox, replyToMessage, markAsRead,
};