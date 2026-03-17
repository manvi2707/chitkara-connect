const express = require("express");
const router = express.Router();
const { protect, studentOnly, facultyOnly } = require("../middleware/authMiddleware");
const {
  bookMeeting,
  getStudentMeetings,
  getFacultyMeetings,
  respondToMeeting,
} = require("../controllers/meetingController");

// Student books a meeting with a faculty
router.post("/book", protect, studentOnly, bookMeeting);

// Student views all their own meeting requests
router.get("/my-meetings", protect, studentOnly, getStudentMeetings);

// Faculty views all meeting requests sent to them
router.get("/faculty-meetings", protect, facultyOnly, getFacultyMeetings);

// Faculty accepts or rejects a specific meeting
router.put("/:meetingId/respond", protect, facultyOnly, respondToMeeting);

module.exports = router;
