// =============================================
// server/routes/authRoutes.js
// =============================================

const express = require("express");
const router  = express.Router();
const {
  registerStudent,
  loginStudent,
  registerFaculty,
  loginFaculty,
} = require("../controllers/authController");
const { deleteAccount }   = require("../controllers/deleteAccountController");
const { changePassword }  = require("../controllers/changePasswordController");
const { protect }         = require("../middleware/authMiddleware");

// ── Student auth ──────────────────────────────
router.post("/student/register", registerStudent);
router.post("/student/login",    loginStudent);

// ── Faculty auth ──────────────────────────────
router.post("/faculty/register", registerFaculty);
router.post("/faculty/login",    loginFaculty);

// ── Account management (any role, must be logged in) ──
router.put("/change-password",  protect, changePassword);
router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
