// =============================================
// components/PhotoUpload.jsx — Global Photo Upload
// =============================================
// Now uses updatePhoto from AuthContext
// So photo updates EVERYWHERE after upload

import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import UserAvatar from "./UserAvatar";
import API from "../utils/api";

const PhotoUpload = ({ onClose }) => {
  const { user, profilePhoto, updatePhoto } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(profilePhoto || "");
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) {
      toast.error("Invalid file", "Only JPEG, PNG or WebP images allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Too large", "Maximum photo size is 5MB.");
      return;
    }

    // Show instant local preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const endpoint = user.role === "faculty"
        ? "/upload/faculty-photo"
        : "/upload/student-photo";

      const response = await API.post(endpoint, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // ← This updates photo GLOBALLY across all components
      updatePhoto(response.data.photoUrl);
      setPreview(response.data.photoUrl);
      toast.success("Photo updated!", "Your profile photo looks great.");

      // Close popup after short delay
      setTimeout(() => onClose?.(), 1000);
    } catch (err) {
      toast.error("Upload failed", err.response?.data?.message || "Could not upload photo.");
      setPreview(profilePhoto || "");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await API.delete("/upload/photo");
      updatePhoto(""); // ← clears photo GLOBALLY
      setPreview("");
      toast.success("Photo removed", "Profile photo has been removed.");
      setTimeout(() => onClose?.(), 800);
    } catch (err) {
      toast.error("Failed", "Could not remove photo.");
    } finally {
      setLoading(false);
    }
  };

  const isStudent = user?.role === "student";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
        onClick={() => !loading && onClose?.()}
      />

      {/* Popup */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-80">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className={`px-5 py-4 flex justify-between items-center ${
            isStudent
              ? "bg-gradient-to-r from-blue-600 to-blue-700"
              : "bg-gradient-to-r from-emerald-600 to-emerald-700"
          }`}>
            <h3 className="font-bold text-white">Update Profile Photo</h3>
            <button
              onClick={() => !loading && onClose?.()}
              className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white text-sm transition"
            >
              ✕
            </button>
          </div>

          <div className="p-5">
            {/* Current photo preview */}
            <div className="flex justify-center mb-5">
              <div className="relative">
                <UserAvatar
                  name={user?.name}
                  photo={preview}
                  role={user?.role}
                  size="2xl"
                  shape="rounded"
                  className="border-4 border-gray-100 shadow-lg"
                />
                {loading && (
                  <div className="absolute inset-0 rounded-xl bg-black/50 flex items-center justify-center">
                    <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Drag and drop zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition mb-3 ${
                dragging
                  ? isStudent
                    ? "border-blue-500 bg-blue-50 scale-105"
                    : "border-emerald-500 bg-emerald-50 scale-105"
                  : isStudent
                  ? "border-gray-200 hover:border-blue-400 hover:bg-blue-50/50"
                  : "border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/50"
              }`}
            >
              <div className="text-2xl mb-1">{dragging ? "📂" : "📸"}</div>
              <p className="text-sm font-semibold text-gray-700">
                {dragging ? "Drop photo here!" : "Click or drag to upload"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                JPEG, PNG or WebP · Max 5MB
              </p>
            </div>

            {/* Hidden input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={(e) => handleFile(e.target.files[0])}
              className="hidden"
            />

            {/* Remove button */}
            {preview && !loading && (
              <button
                onClick={handleRemove}
                className="w-full text-center text-xs text-red-500 hover:text-red-700 py-2 hover:bg-red-50 rounded-lg transition"
              >
                🗑️ Remove current photo
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PhotoUpload;
