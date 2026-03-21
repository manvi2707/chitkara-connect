// =============================================
// server/controllers/meetingController.js
// =============================================
// Updated: triggers availability check after
// every booking and response

const Meeting = require("../models/Meeting");
const { checkAndUpdateFacultyAvailability } = require("./availabilityController");

// ── BOOK A MEETING ───────────────────────────
const bookMeeting = async (req, res) => {
  try {
    const { facultyId, date, timeSlot, reason } = req.body;

    // Check the slot is not already taken
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const existing = await Meeting.findOne({
      faculty:  facultyId,
      date:     { $gte: selectedDate, $lt: nextDay },
      timeSlot: timeSlot,
      status:   { $in: ["pending", "accepted"] },
    });

    if (existing) {
      return res.status(400).json({
        message: "This time slot is already booked. Please choose another.",
      });
    }

    const meeting = await Meeting.create({
      student:  req.user.id,
      faculty:  facultyId,
      date,
      timeSlot,
      reason,
    });

    // ← Check if faculty still has free slots after this booking
    await checkAndUpdateFacultyAvailability(facultyId);

    res.status(201).json({ message: "Meeting request sent!", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET STUDENT'S OWN MEETINGS ───────────────
const getStudentMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ student: req.user.id })
      .populate("faculty", "name email department officeAddress designation profilePhoto")
      .sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET FACULTY'S RECEIVED MEETINGS ──────────
const getFacultyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ faculty: req.user.id })
      .populate("student", "name email department year rollNumber profilePhoto")
      .sort({ createdAt: -1 });
    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── FACULTY RESPONDS TO A MEETING ────────────
const respondToMeeting = async (req, res) => {
  try {
    const { status, facultyNote } = req.body;

    const meeting = await Meeting.findById(req.params.meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    if (meeting.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized." });
    }

    meeting.status     = status;
    meeting.facultyNote = facultyNote || "";
    await meeting.save();

    // ← Re-check availability after response
    // If faculty rejected a meeting — that slot is free again
    // If accepted — check if still has other free slots
    await checkAndUpdateFacultyAvailability(meeting.faculty.toString());

    res.json({ message: `Meeting ${status} successfully!`, meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  bookMeeting,
  getStudentMeetings,
  getFacultyMeetings,
  respondToMeeting,
};
