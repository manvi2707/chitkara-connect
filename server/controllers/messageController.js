// =============================================
// server/controllers/messageController.js
// FIXED: conversation lookup bug, delivery receipts
// =============================================

const Message      = require("../models/Message");
const Conversation = require("../models/Conversation");

// ── Helper: find or create conversation ──────
// FIX: previous query used $all on nested field which is unreliable
// New query: find conversation where BOTH user IDs appear in participants array
const findOrCreateConversation = async (userA, userAModel, userB, userBModel) => {
  // Find conversation containing both userA and userB as participants
  let conversation = await Conversation.findOne({
    $and: [
      { "participants.user": userA },
      { "participants.user": userB },
    ],
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [
        { user: userA, userModel: userAModel },
        { user: userB, userModel: userBModel },
      ],
      unreadCount: new Map([
        [userA.toString(), 0],
        [userB.toString(), 0],
      ]),
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

    // Mark messages as delivered for this user (they're now online)
    await Message.updateMany(
      { receiver: userId, isDelivered: false },
      { isDelivered: true }
    );

    // Notify senders via socket that messages delivered
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    if (io && onlineUsers) {
      const deliveredMsgs = await Message.find(
        { receiver: userId, isDelivered: true, isReadByReceiver: false },
        "sender conversation"
      );
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
        try {
          const other = convo.participants.find(
            (p) => p.user.toString() !== userId
          );
          if (!other) return null;

          const OtherModel = require(`../models/${other.userModel}`);
          const otherUser  = await OtherModel.findById(other.user).select(
            "name email profilePhoto department"
          );
          if (!otherUser) return null;

          // FIX: unreadCount is a Map — use .get() safely
          const unread = convo.unreadCount instanceof Map
            ? (convo.unreadCount.get(userId.toString()) || 0)
            : (convo.unreadCount?.[userId] || 0);

          return {
            _id:       convo._id,
            updatedAt: convo.updatedAt,
            otherUser: { ...otherUser.toObject(), role: other.userModel.toLowerCase() },
            lastMessage: convo.lastMessage,
            unreadCount: unread,
          };
        } catch (err) {
          console.error("Error populating conversation:", err.message);
          return null;
        }
      })
    );

    res.json(populated.filter(Boolean)); // remove nulls
  } catch (error) {
    console.error("getConversations error:", error);
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
    if (convo.unreadCount instanceof Map) {
      convo.unreadCount.set(userId.toString(), 0);
    } else {
      convo.unreadCount = convo.unreadCount || {};
      convo.unreadCount[userId] = 0;
    }
    convo.markModified("unreadCount");
    await convo.save();

    // Notify the sender via socket that messages were read
    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");
    if (io && onlineUsers) {
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
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── SEND A MESSAGE ────────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, body, subject } = req.body;

    if (!receiverId || !receiverModel || !body?.trim()) {
      return res.status(400).json({ message: "receiverId, receiverModel, and body are required." });
    }

    const senderModel = req.user.role === "student" ? "Student" : "Faculty";
    const senderId    = req.user.id;

    const conversation = await findOrCreateConversation(
      senderId, senderModel, receiverId, receiverModel
    );

    // Check if receiver is currently online
    const onlineUsers = req.app.get("onlineUsers");
    const isReceiverOnline = onlineUsers?.has(receiverId.toString());

    const message = await Message.create({
      conversation:    conversation._id,
      sender:          senderId,
      senderModel,
      receiver:        receiverId,
      receiverModel,
      body:            body.trim(),
      subject:         subject || "",
      isDelivered:     isReceiverOnline,
      isReadByReceiver: false,
    });

    await message.populate("sender", "name profilePhoto");

    // Update conversation unread count
    const currentUnread = conversation.unreadCount instanceof Map
      ? (conversation.unreadCount.get(receiverId.toString()) || 0)
      : (conversation.unreadCount?.[receiverId] || 0);

    if (conversation.unreadCount instanceof Map) {
      conversation.unreadCount.set(receiverId.toString(), currentUnread + 1);
    }
    conversation.markModified("unreadCount");
    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
      message: "Message sent!",
      data: message,
      conversationId: conversation._id,
    });
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── OPEN / CREATE CONVERSATION ────────────────
const getOrCreateConversation = async (req, res) => {
  try {
    const { otherUserId, otherUserModel } = req.body;
    if (!otherUserId || !otherUserModel) {
      return res.status(400).json({ message: "otherUserId and otherUserModel are required." });
    }
    const senderModel = req.user.role === "student" ? "Student" : "Faculty";
    const conversation = await findOrCreateConversation(
      req.user.id, senderModel, otherUserId, otherUserModel
    );
    res.json({ conversationId: conversation._id });
  } catch (error) {
    console.error("getOrCreateConversation error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── BACKWARDS COMPAT ─────────────────────────
const getInbox = getConversations;

const replyToMessage = async (req, res) => {
  try {
    const parent = await Message.findOne({
      _id: req.params.messageId, receiver: req.user.id,
    });
    if (!parent) return res.status(404).json({ message: "Message not found." });
    req.body.receiverId    = parent.sender;
    req.body.receiverModel = parent.senderModel;
    return sendMessage(req, res);
  } catch (e) {
    res.status(500).json({ message: "Server error: " + e.message });
  }
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
