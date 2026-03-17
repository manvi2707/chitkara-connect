const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getInbox,
  replyToMessage,
  markAsRead,
} = require("../controllers/messageController");

// Send a new message (both students AND faculty can send)
router.post("/send", protect, sendMessage);

// View your inbox (both roles)
router.get("/inbox", protect, getInbox);

// Reply to a message (both roles)
router.post("/:messageId/reply", protect, replyToMessage);

// Mark a message as read (both roles)
router.put("/:messageId/read", protect, markAsRead);

module.exports = router;
