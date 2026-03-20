// =============================================
// server/controllers/facultyController.js
// =============================================
// Updated: name and department can now be updated

const Faculty = require("../models/Faculty");

// GET all faculty
const getAllFaculty = async (req, res) => {
  try {
    const facultyList = await Faculty.find().select("-password");
    res.json(facultyList);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// GET single faculty by ID
const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id).select("-password");
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }
    res.json(faculty);
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// PUT update faculty profile
// Now includes name and department too
const updateFacultyProfile = async (req, res) => {
  try {
    const {
      name,           // ← NEW
      department,     // ← NEW
      designation,
      bio,
      officeAddress,
      visitingHours,
      expertise,
      phone,
      isAvailable,
    } = req.body;

    // Validate name is not empty
    if (name && name.trim().length < 2) {
      return res.status(400).json({ message: "Name must be at least 2 characters." });
    }

    // Validate department is a valid value
    const validDepartments = ["CSE", "ECE", "ME", "CE", "IT", "MBA", "Other"];
    if (department && !validDepartments.includes(department)) {
      return res.status(400).json({ message: "Invalid department." });
    }

    const faculty = await Faculty.findByIdAndUpdate(
      req.user.id,
      {
        name,
        department,
        designation,
        bio,
        officeAddress,
        visitingHours,
        expertise,
        phone,
        isAvailable,
      },
      { new: true, runValidators: true }
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
