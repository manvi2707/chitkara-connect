// =============================================
// server/routes/messageRoutes.js — Updated
// =============================================

const express = require("express");
const router  = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getConversations,
  getMessages,
  sendMessage,
  getOrCreateConversation,
  getInbox,
  replyToMessage,
  markAsRead,
} = require("../controllers/messageController");

// ── New conversation-based routes ────────────
// Get all conversation threads (sidebar)
router.get("/conversations", protect, getConversations);

// Get all messages in a thread
router.get("/conversations/:conversationId/messages", protect, getMessages);

// Start or open a conversation with someone
router.post("/conversations/open", protect, getOrCreateConversation);

// Send a message (creates conversation if needed)
router.post("/send", protect, sendMessage);

// ── Old routes kept for backwards compat ─────
router.get("/inbox",               protect, getInbox);
router.post("/:messageId/reply",   protect, replyToMessage);
router.put("/:messageId/read",     protect, markAsRead);

module.exports = router;