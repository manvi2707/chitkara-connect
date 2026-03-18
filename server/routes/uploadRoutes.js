// =============================================
// server/routes/uploadRoutes.js
// =============================================

const express = require("express");
const router = express.Router();
const { protect, facultyOnly, studentOnly } = require("../middleware/authMiddleware");
const { uploadPhoto } = require("../middleware/uploadMiddleware");
const {
  uploadFacultyPhoto,
  uploadStudentPhoto,
  deletePhoto,
} = require("../controllers/uploadController");

// Faculty uploads their profile photo
router.post("/faculty-photo", protect, facultyOnly, uploadPhoto, uploadFacultyPhoto);

// Student uploads their profile photo
router.post("/student-photo", protect, studentOnly, uploadPhoto, uploadStudentPhoto);

// Delete photo — works for both roles
router.delete("/photo", protect, deletePhoto);

module.exports = router;