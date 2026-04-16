// =============================================
// server/controllers/meetingController.js
// =============================================
// Updated: fires email notifications when
//   • a meeting is booked  → email to faculty
//   • faculty accepts      → email to student
//   • faculty rejects      → email to student
//
// Emails are sent fire-and-forget (non-blocking)
// so a mail failure never breaks the API response.

const Meeting  = require("../models/Meeting");
const Student  = require("../models/Student");
const Faculty  = require("../models/Faculty");
const { checkAndUpdateFacultyAvailability } = require("./availabilityController");
const {
  sendMeetingRequestEmail,
  sendMeetingAcceptedEmail,
  sendMeetingRejectedEmail,
} = require("../utils/emailService");

// ── BOOK A MEETING ───────────────────────────
// POST /api/meetings/book  — student only
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

    // Create the meeting
    const meeting = await Meeting.create({
      student:  req.user.id,
      faculty:  facultyId,
      date,
      timeSlot,
      reason,
    });

    // Re-check faculty availability after this booking
    await checkAndUpdateFacultyAvailability(facultyId);

    // ── Fire email to faculty (non-blocking) ──
    // We fetch the student and faculty docs for their email addresses.
    // Using Promise.all so we only do two DB reads in parallel.
    Promise.all([
      Student.findById(req.user.id).select("name email department year"),
      Faculty.findById(facultyId).select("name email department designation"),
    ])
      .then(([student, faculty]) => {
        if (student && faculty) {
          sendMeetingRequestEmail({ faculty, student, meeting }).catch((err) =>
            console.error("📧 Email error (booking):", err.message)
          );
        }
      })
      .catch((err) => console.error("📧 Email fetch error:", err.message));

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
// PUT /api/meetings/:meetingId/respond  — faculty only
const respondToMeeting = async (req, res) => {
  try {
    const { status, facultyNote } = req.body;

    // Find and verify ownership
    const meeting = await Meeting.findById(req.params.meetingId);
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found." });
    }
    if (meeting.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized." });
    }

    // Save the response
    meeting.status      = status;
    meeting.facultyNote = facultyNote || "";
    await meeting.save();

    // Re-check availability (rejected slot becomes free again)
    await checkAndUpdateFacultyAvailability(meeting.faculty.toString());

    // ── Fire email to student (non-blocking) ──
    // Fetch both user docs in parallel for their emails
    Promise.all([
      Faculty.findById(req.user.id).select("name email department designation officeAddress"),
      Student.findById(meeting.student).select("name email department year"),
    ])
      .then(([faculty, student]) => {
        if (!faculty || !student) return;

        const emailFn = status === "accepted"
          ? sendMeetingAcceptedEmail
          : sendMeetingRejectedEmail;

        emailFn({ faculty, student, meeting }).catch((err) =>
          console.error(`📧 Email error (${status}):`, err.message)
        );
      })
      .catch((err) => console.error("📧 Email fetch error:", err.message));

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
