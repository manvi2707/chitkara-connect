// =============================================
// server/controllers/deleteAccountController.js
// =============================================
// Handles account deletion for both Students and Faculty.
// When an account is deleted, ALL related data is removed:
//   • Student: meetings they booked, conversations, messages
//   • Faculty: meetings requested to them, conversations, messages, profile
// After deletion, the user is logged out automatically on the frontend.

const Student      = require("../models/Student");
const Faculty      = require("../models/Faculty");
const Meeting      = require("../models/Meeting");
const Message      = require("../models/Message");
const Conversation = require("../models/Conversation");
const bcrypt       = require("bcryptjs");
const cloudinary   = require("../utils/cloudinary");

// ── Helper: delete all conversations + messages for a user ──
const deleteUserConversationsAndMessages = async (userId) => {
  // Find every conversation this user is a participant in
  const conversations = await Conversation.find({
    "participants.user": userId,
  });

  const conversationIds = conversations.map((c) => c._id);

  // Delete all messages in those conversations
  if (conversationIds.length > 0) {
    await Message.deleteMany({ conversation: { $in: conversationIds } });
  }

  // Delete the conversation threads themselves
  await Conversation.deleteMany({ "participants.user": userId });
};

// ── Helper: delete Cloudinary photo if it exists ──
const deleteCloudinaryPhoto = async (photoUrl) => {
  if (!photoUrl) return;
  try {
    // Extract the public_id from the Cloudinary URL
    // URL format: https://res.cloudinary.com/<cloud>/image/upload/v12345/chitkara/<publicId>.jpg
    const parts = photoUrl.split("/");
    const fileWithExt = parts[parts.length - 1];             // e.g. "abc123.jpg"
    const folder      = parts[parts.length - 2];             // e.g. "chitkara"
    const publicId    = `${folder}/${fileWithExt.split(".")[0]}`;
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    // Non-critical — log but don't block deletion
    console.error("Cloudinary delete error:", err.message);
  }
};

// ── DELETE ACCOUNT ────────────────────────────
// DELETE /api/auth/delete-account
// Requires: valid JWT (any role)
// Body: { password } — user must confirm password before deletion
const deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    const { id, role } = req.user;

    // ── 1. Find the user and verify password ──
    let userDoc;
    if (role === "student") {
      userDoc = await Student.findById(id);
    } else if (role === "faculty") {
      userDoc = await Faculty.findById(id);
    } else {
      return res.status(400).json({ message: "Unknown role." });
    }

    if (!userDoc) {
      return res.status(404).json({ message: "Account not found." });
    }

    // Password confirmation is required for security
    if (!password) {
      return res.status(400).json({ message: "Password is required to delete your account." });
    }

    const isMatch = await userDoc.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password. Account not deleted." });
    }

    // ── 2. Delete Cloudinary profile photo ────
    await deleteCloudinaryPhoto(userDoc.profilePhoto);

    // ── 3. Delete all conversations & messages ─
    await deleteUserConversationsAndMessages(id);

    // ── 4. Role-specific data cleanup ─────────
    if (role === "student") {
      // Delete all meetings this student booked
      await Meeting.deleteMany({ student: id });

      // Delete the student's own account
      await Student.findByIdAndDelete(id);

    } else if (role === "faculty") {
      // Delete all meetings requested to this faculty
      await Meeting.deleteMany({ faculty: id });

      // Delete the faculty's own account
      await Faculty.findByIdAndDelete(id);
    }

    // ── 5. Done! ──────────────────────────────
    res.json({
      message: "Your account and all associated data have been permanently deleted.",
    });

  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { deleteAccount };
