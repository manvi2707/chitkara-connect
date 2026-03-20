// =============================================
// pages/FacultyProfileEdit.jsx
// =============================================
// Updated: name and department fields added

import { useState, useEffect } from "react";
import { updateFacultyProfile, getFacultyById } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { ProfileSkeleton } from "../components/LoadingSkeleton";
import UserAvatar from "../components/UserAvatar";
import PhotoUpload from "../components/PhotoUpload";

const FacultyProfileEdit = () => {
  const { user, profilePhoto } = useAuth();
  const toast = useToast();

  const [loading, setLoading]                 = useState(false);
  const [fetching, setFetching]               = useState(true);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const [formData, setFormData] = useState({
    name:          "",   // ← NEW
    department:    "",   // ← NEW
    designation:   "",
    bio:           "",
    officeAddress: "",
    visitingHours: "",
    expertise:     "",
    phone:         "",
    isAvailable:   true,
  });

  // Load existing profile data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getFacultyById(user.id || user._id);
        const f = res.data;
        setFormData({
          name:          f.name          || "",
          department:    f.department    || "CSE",
          designation:   f.designation   || "Assistant Professor",
          bio:           f.bio           || "",
          officeAddress: f.officeAddress || "",
          visitingHours: f.visitingHours || "",
          expertise:     f.expertise?.join(", ") || "",
          phone:         f.phone         || "",
          isAvailable:   f.isAvailable   ?? true,
        });
      } catch (err) {
        toast.error("Load failed", "Could not load your profile.");
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        expertise: formData.expertise
          .split(",").map((s) => s.trim()).filter(Boolean),
      };
      await updateFacultyProfile(dataToSend);
      toast.success("Profile saved!", "Your profile has been updated.");
    } catch (err) {
      toast.error("Save failed", err.response?.data?.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <ProfileSkeleton />;

  const expertiseTags = formData.expertise
    .split(",").map((s) => s.trim()).filter(Boolean);

  return (
    <>
      <div className="p-4 sm:p-6 w-full max-w-2xl overflow-x-hidden">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">
            Students see this information in the Faculty Directory
          </p>
        </div>

        {/* ── Photo section ── */}
        <div className="bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 sm:p-6 mb-6">
          <h2 className="font-bold text-gray-800 mb-1">Profile Photo</h2>
          <p className="text-xs text-gray-500 mb-4">
            Appears on your faculty card in the student directory
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <UserAvatar
              name={formData.name || user?.name}
              photo={profilePhoto}
              role="faculty"
              size="2xl"
              shape="rounded"
              className="border-4 border-white shadow-md flex-shrink-0"
            />
            <div className="w-full sm:flex-1">
              <button
                onClick={() => setShowPhotoUpload(true)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-xl font-semibold text-sm transition mb-2"
              >
                📸 Upload New Photo
              </button>
              <p className="text-xs text-gray-400 text-center">
                JPEG, PNG or WebP · Max 5MB
              </p>
            </div>
          </div>
        </div>

        {/* ── Profile form ── */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* ── SECTION: Personal Info ── */}
          <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
            <h3 className="font-bold text-blue-800 text-sm mb-4 flex items-center gap-2">
              👤 Personal Information
            </h3>

            {/* Name */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g. Dr. Priya Sharma"
                className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>

            {/* Department + Designation side by side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                >
                  {["CSE", "ECE", "ME", "CE", "IT", "MBA", "Other"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Designation
                </label>
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                >
                  {["Assistant Professor", "Associate Professor", "Professor", "HOD"].map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* ── SECTION: About ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Bio
              <span className="text-gray-400 font-normal ml-1 text-xs">(max 500 chars)</span>
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={3}
              maxLength={500}
              placeholder="Tell students about your background and teaching style..."
              className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {formData.bio.length}/500
            </p>
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Expertise
              <span className="text-gray-400 font-normal ml-1 text-xs">(comma separated)</span>
            </label>
            <input
              type="text"
              name="expertise"
              value={formData.expertise}
              onChange={handleChange}
              placeholder="e.g. Machine Learning, React, Data Structures"
              className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
            />
            {/* Live tag preview */}
            {expertiseTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {expertiseTags.map((tag) => (
                  <span key={tag}
                    className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Office + Hours */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Office Address
              </label>
              <input
                type="text"
                name="officeAddress"
                value={formData.officeAddress}
                onChange={handleChange}
                placeholder="e.g. Room 204, Block A"
                className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Visiting Hours
              </label>
              <input
                type="text"
                name="visitingHours"
                value={formData.visitingHours}
                onChange={handleChange}
                placeholder="e.g. Mon-Wed: 10am-12pm"
                className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Phone / Extension
            </label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. Ext. 2045"
              className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
            />
          </div>

          {/* Availability toggle */}
          <div className="flex items-center justify-between bg-gray-50 border-2 border-gray-200 rounded-xl px-4 py-4 gap-4">
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm">Available for Meetings</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {formData.isAvailable
                  ? "Students can book meetings with you"
                  : "Not accepting meetings currently"}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                name="isAvailable"
                checked={formData.isAvailable}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-gray-300 peer-checked:bg-emerald-500 rounded-full transition-colors" />
              <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-6 transition-transform" />
            </label>
          </div>

          {/* Save button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-500/20"
          >
            {loading ? "Saving..." : "💾 Save Profile"}
          </button>
        </form>
      </div>

      {/* Photo upload popup */}
      {showPhotoUpload && (
        <PhotoUpload onClose={() => setShowPhotoUpload(false)} />
      )}
    </>
  );
};

export default FacultyProfileEdit;
