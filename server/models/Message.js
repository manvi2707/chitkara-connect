const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    // Who sent the message
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "senderModel",   // dynamic — points to Student OR Faculty
    },
    senderModel: {
      type: String,
      required: true,
      enum: ["Student", "Faculty"],  // tells mongoose which collection to look in
    },

    // Who receives the message
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

    subject: {
      type: String,
      required: [true, "Subject is required"],
      maxlength: 150,
    },
    body: {
      type: String,
      required: [true, "Message body cannot be empty"],
    },
    isRead: {
      type: Boolean,
      default: false,   // unread when first received
    },
    // If this is a reply, store the original message ID
    parentMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,    // null means it's a fresh message, not a reply
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);