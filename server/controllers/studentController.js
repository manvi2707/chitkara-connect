// =============================================
// server/controllers/studentController.js
// =============================================
// Allows students to view and update their
// own profile information (name, year, rollNumber).
// Email and department are locked after registration.

const Student = require("../models/Student");

// ── GET OWN PROFILE ───────────────────────────
// GET /api/student/profile
// Protected — student only
const getStudentProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── UPDATE OWN PROFILE ────────────────────────
// PUT /api/student/profile
// Protected — student only
// Students can update: name, year, rollNumber
// (email and department are fixed)
const updateStudentProfile = async (req, res) => {
  try {
    const { name, year, rollNumber } = req.body;

    // Validate name
    if (name && name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }

    // Validate year
    if (year && (year < 1 || year > 5)) {
      return res.status(400).json({ message: "Year must be between 1 and 5." });
    }

    const student = await Student.findByIdAndUpdate(
      req.user.id,
      { name, year, rollNumber },
      { new: true, runValidators: true }
    ).select("-password");

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    res.json({ message: "Profile updated successfully!", student });
  } catch (error) {
    // Handle duplicate roll number error from MongoDB
    if (error.code === 11000) {
      return res.status(400).json({ message: "This roll number is already registered." });
    }
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { getStudentProfile, updateStudentProfile };
