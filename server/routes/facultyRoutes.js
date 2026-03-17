const express = require("express");
const router = express.Router();
const { protect, facultyOnly } = require("../middleware/authMiddleware");
const {
  getAllFaculty,
  getFacultyById,
  updateFacultyProfile,
} = require("../controllers/facultyController");

// ── PUBLIC routes (no login needed) ─────────
// Students and visitors can browse faculty without logging in
router.get("/", getAllFaculty);         // GET all faculty
router.get("/:id", getFacultyById);     // GET one faculty by their ID

// ── PROTECTED route (faculty login required) ─
// Only a logged-in faculty can update their OWN profile
router.put("/profile/update", protect, facultyOnly, updateFacultyProfile);

module.exports = router;