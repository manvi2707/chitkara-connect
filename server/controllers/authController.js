// =============================================
// server/controllers/authController.js
// =============================================
// Fix: profilePhoto now included in ALL responses
// So photo loads correctly after every login

const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Faculty = require("../models/Faculty");

// Helper: generates JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ── STUDENT REGISTER ─────────────────────────
const registerStudent = async (req, res) => {
  try {
    const { name, email, password, department, year, rollNumber } = req.body;

    const existing = await Student.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const student = await Student.create({
      name, email, password, department, year, rollNumber,
    });

    res.status(201).json({
      message: "Student registered successfully!",
      token: generateToken(student._id, "student"),
      user: {
        id:           student._id,
        name:         student.name,
        email:        student.email,
        role:         "student",
        department:   student.department,
        profilePhoto: student.profilePhoto || "", // ← included
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── STUDENT LOGIN ────────────────────────────
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await student.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      message: "Login successful!",
      token: generateToken(student._id, "student"),
      user: {
        id:           student._id,
        name:         student.name,
        email:        student.email,
        role:         "student",
        department:   student.department,
        profilePhoto: student.profilePhoto || "", // ← included
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── FACULTY REGISTER ─────────────────────────
const registerFaculty = async (req, res) => {
  try {
    const { name, email, password, department, designation } = req.body;

    const existing = await Faculty.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered." });
    }

    const faculty = await Faculty.create({
      name, email, password, department, designation,
    });

    res.status(201).json({
      message: "Faculty registered successfully!",
      token: generateToken(faculty._id, "faculty"),
      user: {
        id:           faculty._id,
        name:         faculty.name,
        email:        faculty.email,
        role:         "faculty",
        department:   faculty.department,
        profilePhoto: faculty.profilePhoto || "", // ← included
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── FACULTY LOGIN ────────────────────────────
const loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;

    const faculty = await Faculty.findOne({ email });
    if (!faculty) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await faculty.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    res.json({
      message: "Login successful!",
      token: generateToken(faculty._id, "faculty"),
      user: {
        id:           faculty._id,
        name:         faculty.name,
        email:        faculty.email,
        role:         "faculty",
        department:   faculty.department,
        profilePhoto: faculty.profilePhoto || "", // ← included
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = {
  registerStudent,
  loginStudent,
  registerFaculty,
  loginFaculty,
};
