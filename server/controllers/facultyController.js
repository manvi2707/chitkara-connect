const Faculty = require("../models/Faculty");

// ── GET ALL FACULTY ──────────────────────────
// GET /api/faculty
// Public — no login needed
// Used by the Faculty Directory page
const getAllFaculty = async (req, res) => {
  try {
    // .select("-password") means return everything EXCEPT the password field
    // Never send passwords to the frontend — even hashed ones
    const facultyList = await Faculty.find().select("-password");

    res.json(facultyList);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── GET SINGLE FACULTY ───────────────────────
// GET /api/faculty/:id
// Public — used when clicking on a faculty card for full details
const getFacultyById = async (req, res) => {
  try {
    // req.params.id comes from the URL → /api/faculty/64abc123
    const faculty = await Faculty.findById(req.params.id).select("-password");

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── UPDATE FACULTY PROFILE ───────────────────
// PUT /api/faculty/profile/update
// Protected — only logged-in faculty can update their OWN profile
const updateFacultyProfile = async (req, res) => {
  try {
    // Pull out only the fields faculty is allowed to update
    const {
      bio,
      officeAddress,
      visitingHours,
      expertise,       // array: ["Machine Learning", "DBMS"]
      phone,
      isAvailable,     // boolean: true or false
      designation,
    } = req.body;

    // req.user.id comes from the JWT token (set by authMiddleware)
    // This ensures faculty can only update THEIR OWN profile, not anyone else's
    const faculty = await Faculty.findByIdAndUpdate(
      req.user.id,
      { bio, officeAddress, visitingHours, expertise, phone, isAvailable, designation },
      { new: true, runValidators: true }
      // new: true → return the UPDATED document (not the old one)
      // runValidators: true → check schema rules when updating too
    ).select("-password");

    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    res.json({ message: "Profile updated successfully!", faculty });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

module.exports = { getAllFaculty, getFacultyById, updateFacultyProfile };