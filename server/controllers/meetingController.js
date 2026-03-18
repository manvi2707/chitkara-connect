// =============================================
// server/controllers/meetingController.js
// =============================================
// Fix: added profilePhoto to all .populate() calls
// So meeting cards can show real photos

const Meeting = require("../models/Meeting");

// ── BOOK A MEETING ───────────────────────────
const bookMeeting = async (req, res) => {
  try {
    const { facultyId, date, timeSlot, reason } = req.body;

    const meeting = await Meeting.create({
      student: req.user.id,
      faculty: facultyId,
      date,
      timeSlot,
      reason,
    });

    res.status(201).json({ message: "Meeting request sent!", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET STUDENT'S OWN MEETINGS ───────────────
const getStudentMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ student: req.user.id })
      .populate(
        "faculty",
        // ← Added profilePhoto here so card shows real photo
        "name email department officeAddress designation profilePhoto"
      )
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
      .populate(
        "student",
        // ← Added profilePhoto here too
        "name email department year rollNumber profilePhoto"
      )
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

    meeting.status = status;
    meeting.facultyNote = facultyNote || "";
    await meeting.save();

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
