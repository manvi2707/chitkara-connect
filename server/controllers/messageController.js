// =============================================
// server/controllers/messageController.js
// =============================================
// Fix: added profilePhoto to .populate("sender")
// So message cards show real sender photos

const Message = require("../models/Message");

// ── SEND A MESSAGE ───────────────────────────
const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, subject, body } = req.body;
    const senderModel = req.user.role === "student" ? "Student" : "Faculty";

    const message = await Message.create({
      sender: req.user.id,
      senderModel,
      receiver: receiverId,
      receiverModel,
      subject,
      body,
    });

    res.status(201).json({ message: "Message sent!", data: message });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET INBOX ────────────────────────────────
const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      .populate(
        "sender",
        // ← Added profilePhoto so message card shows real sender photo
        "name email profilePhoto"
      )
      .sort({ createdAt: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── REPLY TO A MESSAGE ───────────────────────
const replyToMessage = async (req, res) => {
  try {
    const { body } = req.body;

    const parentMessage = await Message.findById(req.params.messageId);
    if (!parentMessage) {
      return res.status(404).json({ message: "Original message not found." });
    }

    const senderModel = req.user.role === "student" ? "Student" : "Faculty";
    const receiverModel = senderModel === "Student" ? "Faculty" : "Student";

    const reply = await Message.create({
      sender: req.user.id,
      senderModel,
      receiver: parentMessage.sender,
      receiverModel,
      subject: "Re: " + parentMessage.subject,
      body,
      parentMessage: parentMessage._id,
    });

    res.status(201).json({ message: "Reply sent!", data: reply });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── MARK AS READ ─────────────────────────────
const markAsRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.messageId, { isRead: true });
    res.json({ message: "Marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { sendMessage, getInbox, replyToMessage, markAsRead };
