const Message = require("../models/Message");

// ── SEND A MESSAGE ───────────────────────────
// POST /api/messages/send
// Both students and faculty can send
const sendMessage = async (req, res) => {
  try {
    const { receiverId, receiverModel, subject, body } = req.body;
    // receiverModel must be "Student" or "Faculty"

    // Determine sender's model from their JWT role
    const senderModel = req.user.role === "student" ? "Student" : "Faculty";

    const message = await Message.create({
      sender: req.user.id,
      senderModel,
      receiver: receiverId,
      receiverModel,
      subject,
      body,
      // isRead defaults to false (defined in model)
      // parentMessage defaults to null (fresh message)
    });

    res.status(201).json({ message: "Message sent!", data: message });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET INBOX ────────────────────────────────
// GET /api/messages/inbox
// Both roles — shows all messages received by logged-in user
const getInbox = async (req, res) => {
  try {
    const messages = await Message.find({ receiver: req.user.id })
      // populate sender to show their name and email
      .populate("sender", "name email")
      .sort({ createdAt: -1 }); // newest first

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── REPLY TO A MESSAGE ───────────────────────
// POST /api/messages/:messageId/reply
// Both roles — reply goes to whoever sent the original
const replyToMessage = async (req, res) => {
  try {
    const { body } = req.body;

    // Find the original message we're replying to
    const parentMessage = await Message.findById(req.params.messageId);
    if (!parentMessage) {
      return res.status(404).json({ message: "Original message not found." });
    }

    // Determine sender and receiver models for the reply
    const senderModel = req.user.role === "student" ? "Student" : "Faculty";
    const receiverModel = senderModel === "Student" ? "Faculty" : "Student";

    const reply = await Message.create({
      sender: req.user.id,
      senderModel,
      receiver: parentMessage.sender,   // reply goes BACK to the original sender
      receiverModel,
      subject: "Re: " + parentMessage.subject,  // add "Re: " prefix automatically
      body,
      parentMessage: parentMessage._id, // link to the original message
    });

    res.status(201).json({ message: "Reply sent!", data: reply });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── MARK MESSAGE AS READ ─────────────────────
// PUT /api/messages/:messageId/read
// Both roles — called when user opens a message
const markAsRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(
      req.params.messageId,
      { isRead: true }
    );
    res.json({ message: "Marked as read." });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { sendMessage, getInbox, replyToMessage, markAsRead };
