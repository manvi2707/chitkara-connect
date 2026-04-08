// =============================================
// server/routes/chatbotRoutes.js
// =============================================

const express = require("express");
const router  = express.Router();

const { protect, studentOnly } = require("../middleware/authMiddleware");
const { chat, test }           = require("../controllers/chatbotController");

// GET /api/chatbot/test — open in browser to diagnose issues (no auth needed)
router.get("/test", test);

// POST /api/chatbot/chat — student sends a message
router.post("/chat", protect, studentOnly, chat);

module.exports = router;