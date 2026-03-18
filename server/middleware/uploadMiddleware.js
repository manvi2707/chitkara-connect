// =============================================
// server/middleware/uploadMiddleware.js
// =============================================
// Multer handles file uploads in Express.
// It reads the file from the request and puts it
// in req.file so our controller can use it.

const multer = require("multer");

// Use memory storage — stores file in RAM as a Buffer
// We then send this buffer to Cloudinary directly
// No files are saved to disk on our server
const storage = multer.memoryStorage();

// File filter — only allow image files
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);  // accept the file
  } else {
    cb(new Error("Only JPEG, PNG and WebP images are allowed."), false);
  }
};

// Create the multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB
  },
});

// Export as middleware that expects a field named "photo"
// Usage in routes: router.post("/upload", protect, uploadPhoto, controller)
const uploadPhoto = upload.single("photo");

module.exports = { uploadPhoto };
