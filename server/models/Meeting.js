const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema(
  {
    // Who is booking the meeting
    student: {
      type: mongoose.Schema.Types.ObjectId,  // stores the student's ID
      ref: "Student",                         // links to Student collection
      required: true,
    },
    // With which faculty
    faculty: {
      type: mongoose.Schema.Types.ObjectId,  // stores the faculty's ID
      ref: "Faculty",                         // links to Faculty collection
      required: true,
    },
    date: {
      type: Date,
      required: [true, "Meeting date is required"],
    },
    timeSlot: {
      type: String,
      required: [true, "Time slot is required"],
      // e.g. "10:00 AM - 10:30 AM"
    },
    reason: {
      type: String,
      required: [true, "Please provide a reason"],
      maxlength: 300,
    },
    // Faculty's response
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",   // always starts as pending
    },
    // Optional note from faculty when rejecting
    facultyNote: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Meeting", meetingSchema);