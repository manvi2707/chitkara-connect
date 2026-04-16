// =============================================
// server/controllers/changePasswordController.js
// =============================================
// Allows a logged-in student or faculty member
// to change their own password by providing:
//   currentPassword — to verify identity
//   newPassword     — must be at least 6 chars

const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

// ── CHANGE PASSWORD ───────────────────────────
// PUT /api/auth/change-password
// Protected — any role
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { id, role } = req.user;

    // ── 1. Validate input ──────────────────────
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters." });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password must be different from current password." });
    }

    // ── 2. Find user ───────────────────────────
    const Model = role === "student" ? Student : Faculty;
    const user  = await Model.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    // ── 3. Verify current password ─────────────
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect." });
    }

    // ── 4. Update password ────────────────────
    // The pre-save hook in the model will auto-hash this
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully! Please log in again." });

  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { changePassword };
