// =============================================
// server/models/Message.js — With Receipts
// =============================================

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Student", "Faculty"],
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      required: true,
      enum: ["Student", "Faculty"],
    },
    body: {
      type: String,
      required: [true, "Message body cannot be empty"],
    },

    // ── Delivery receipt ───────────────────────
    // true when receiver is online or fetches conversations
    isDelivered: {
      type: Boolean,
      default: false,
    },

    // ── Read receipt ───────────────────────────
    // true when receiver opens this conversation thread
    isReadByReceiver: {
      type: Boolean,
      default: false,
    },

    // Legacy — kept for backwards compat
    isRead: {
      type: Boolean,
      default: false,
    },

    subject: { type: String, maxlength: 150, default: "" },
    parentMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);