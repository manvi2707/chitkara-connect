// =============================================
// server/controllers/uploadController.js
// =============================================
// Handles photo upload for both faculty and students

const Faculty = require("../models/Faculty");
const Student = require("../models/Student");
const { uploadToCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");

// ── UPLOAD FACULTY PHOTO ─────────────────────
// POST /api/upload/faculty-photo
// Protected — faculty only
const uploadFacultyPhoto = async (req, res) => {
  try {
    // req.file is set by multer middleware
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded." });
    }

    // Find the faculty in database
    const faculty = await Faculty.findById(req.user.id);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    // If faculty already has a photo, delete the old one from Cloudinary
    if (faculty.profilePhoto) {
      await deleteFromCloudinary(faculty.profilePhoto);
    }

    // Upload new photo to Cloudinary
    // req.file.buffer is the image data in memory (from multer)
    const photoUrl = await uploadToCloudinary(
      req.file.buffer,
      "chitkara-connect/faculty"
    );

    // Save the new URL in MongoDB
    faculty.profilePhoto = photoUrl;
    await faculty.save();

    res.json({
      message: "Photo uploaded successfully!",
      photoUrl,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ message: "Could not upload photo: " + error.message });
  }
};

// ── UPLOAD STUDENT PHOTO ─────────────────────
// POST /api/upload/student-photo
// Protected — student only
const uploadStudentPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No photo uploaded." });
    }

    const student = await Student.findById(req.user.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Delete old photo if exists
    if (student.profilePhoto) {
      await deleteFromCloudinary(student.profilePhoto);
    }

    // Upload to Cloudinary
    const photoUrl = await uploadToCloudinary(
      req.file.buffer,
      "chitkara-connect/students"
    );

    // Save URL in MongoDB
    student.profilePhoto = photoUrl;
    await student.save();

    res.json({
      message: "Photo uploaded successfully!",
      photoUrl,
    });
  } catch (error) {
    console.error("Photo upload error:", error);
    res.status(500).json({ message: "Could not upload photo: " + error.message });
  }
};

// ── DELETE PHOTO ─────────────────────────────
// DELETE /api/upload/photo
// Protected — removes photo and resets to default
const deletePhoto = async (req, res) => {
  try {
    const Model = req.user.role === "faculty" ? Faculty : Student;
    const user = await Model.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Delete from Cloudinary if photo exists
    if (user.profilePhoto) {
      await deleteFromCloudinary(user.profilePhoto);
      user.profilePhoto = "";
      await user.save();
    }

    res.json({ message: "Photo removed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Could not delete photo: " + error.message });
  }
};

module.exports = { uploadFacultyPhoto, uploadStudentPhoto, deletePhoto };
