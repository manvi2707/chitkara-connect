// =============================================
// server/models/Conversation.js
// =============================================
// A Conversation is a unique thread between
// two users (student ↔ faculty).
// Messages reference this conversation.

const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    // The two participants — always [student, faculty]
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          refPath: "participants.userModel",
        },
        userModel: {
          type: String,
          required: true,
          enum: ["Student", "Faculty"],
        },
      },
    ],

    // Cache the last message for sidebar preview
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // Count unread messages per participant
    unreadCount: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  { timestamps: true }
);

// Ensure only ONE conversation exists between any two users
conversationSchema.index({ "participants.user": 1 });

module.exports = mongoose.model("Conversation", conversationSchema);