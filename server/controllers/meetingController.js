const Meeting = require("../models/Meeting");

// ── BOOK A MEETING ───────────────────────────
// POST /api/meetings/book
// Student only
const bookMeeting = async (req, res) => {
  try {
    const { facultyId, date, timeSlot, reason } = req.body;

    // req.user.id is the logged-in student's ID (from JWT token)
    const meeting = await Meeting.create({
      student: req.user.id,
      faculty: facultyId,
      date,
      timeSlot,
      reason,
      // status defaults to "pending" automatically (defined in model)
    });

    res.status(201).json({ message: "Meeting request sent!", meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET STUDENT'S OWN MEETINGS ───────────────
// GET /api/meetings/my-meetings
// Student only — shows all meetings THEY booked
const getStudentMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ student: req.user.id })
      // populate replaces the faculty ID with actual faculty data
      .populate("faculty", "name email department officeAddress designation")
      .sort({ createdAt: -1 }); // newest meeting first

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET FACULTY'S RECEIVED MEETINGS ──────────
// GET /api/meetings/faculty-meetings
// Faculty only — shows all meetings sent TO them
const getFacultyMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ faculty: req.user.id })
      // populate replaces student ID with actual student data
      .populate("student", "name email department year rollNumber")
      .sort({ createdAt: -1 });

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── FACULTY RESPONDS TO A MEETING ────────────
// PUT /api/meetings/:meetingId/respond
// Faculty only — accept or reject
const respondToMeeting = async (req, res) => {
  try {
    const { status, facultyNote } = req.body;
    // status must be "accepted" or "rejected"
    // facultyNote is optional — e.g. "I am busy that day, please reschedule"

    // Find the meeting by the ID in the URL
    const meeting = await Meeting.findById(req.params.meetingId);

    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }

    // Security check: make sure the faculty responding is the
    // SAME faculty the meeting was booked with
    // .toString() is needed because ObjectId and string can't be compared directly
    if (meeting.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to respond to this meeting." });
    }

    // Update the meeting status
    meeting.status = status;
    meeting.facultyNote = facultyNote || "";
    await meeting.save();

    res.json({ message: `Meeting ${status} successfully!`, meeting });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { bookMeeting, getStudentMeetings, getFacultyMeetings, respondToMeeting };