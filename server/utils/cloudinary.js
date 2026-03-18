// =============================================
// server/utils/cloudinary.js
// =============================================
// Cloudinary is a free cloud service that stores images.
// We send the photo here and get back a URL.
// That URL is what we save in MongoDB.

const cloudinary = require("cloudinary").v2;

// Configure cloudinary with your account credentials
// These come from your .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload a file buffer to Cloudinary
// Returns the secure URL of the uploaded image
const uploadToCloudinary = (fileBuffer, folder = "chitkara-connect") => {
  return new Promise((resolve, reject) => {
    // upload_stream sends the file buffer directly to Cloudinary
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,                    // organizes photos in a folder
        resource_type: "image",    // only allow images
        transformation: [
          { width: 400, height: 400, crop: "fill", gravity: "face" },
          // crop to 400x400 square, focusing on the face
          { quality: "auto" },     // auto optimize quality
          { format: "webp" },      // convert to modern webp format
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url); // return the CDN URL
      }
    );
    stream.end(fileBuffer); // send the file buffer to the stream
  });
};

// Delete a photo from Cloudinary by its public ID
const deleteFromCloudinary = async (imageUrl) => {
  try {
    // Extract public ID from URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/publicId.webp
    const parts = imageUrl.split("/");
    const publicIdWithExt = parts.slice(-2).join("/"); // folder/publicId.webp
    const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ""); // remove extension
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.error("Could not delete old photo:", err.message);
    // Don't throw — deleting old photo failing shouldn't block the upload
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
