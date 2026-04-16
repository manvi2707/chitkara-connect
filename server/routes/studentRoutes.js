// =============================================
// server/routes/studentRoutes.js
// =============================================

const express = require("express");
const router  = express.Router();
const { protect, studentOnly } = require("../middleware/authMiddleware");
const { getStudentProfile, updateStudentProfile } = require("../controllers/studentController");

// GET own profile
router.get("/profile", protect, studentOnly, getStudentProfile);

// PUT update own profile
router.put("/profile", protect, studentOnly, updateStudentProfile);

module.exports = router;
