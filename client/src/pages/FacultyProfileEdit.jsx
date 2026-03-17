// =============================================
// FacultyProfileEdit.jsx — Faculty updates profile
// =============================================

import { useState, useEffect } from "react";
import { updateFacultyProfile, getFacultyById } from "../utils/api";
import { useAuth } from "../context/AuthContext";

const FacultyProfileEdit = () => {
  const { user } = useAuth();

  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess]   = useState(false);
  const [error, setError]       = useState("");

  // Form state matches Faculty model fields
  const [formData, setFormData] = useState({
    bio:           "",
    officeAddress: "",
    visitingHours: "",
    expertise:     "",   // stored as comma-separated string, split before saving
    phone:         "",
    designation:   "",
    isAvailable:   true,
  });

  // Load existing profile data when page opens
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await getFacultyById(user.id);
        const f = res.data;
        setFormData({
          bio:           f.bio           || "",
          officeAddress: f.officeAddress || "",
          visitingHours: f.visitingHours || "",
          expertise:     f.expertise?.join(", ") || "", // array → "ML, React, Node"
          phone:         f.phone         || "",
          designation:   f.designation   || "",
          isAvailable:   f.isAvailable   ?? true,
        });
      } catch (err) {
        console.error("Could not load profile:", err);
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError("");

    try {
      // Convert expertise string to array before sending
      // "Machine Learning, React, Node.js" → ["Machine Learning", "React", "Node.js"]
      const dataToSend = {
        ...formData,
        expertise: formData.expertise
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s !== ""), // remove empty strings
      };

      await updateFacultyProfile(dataToSend);
      setSuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not update profile.");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">👤</div>
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-500 text-sm mt-1">
          Update your info — students will see this in the Faculty Directory
        </p>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-5 text-sm">
          ✅ Profile updated successfully!
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-5 text-sm">
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Designation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Designation
          </label>
          <select
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          >
            {["Assistant Professor", "Associate Professor", "Professor", "HOD"].map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Bio <span className="text-gray-400 font-normal">(max 500 characters)</span>
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            maxLength={500}
            placeholder="e.g. I specialize in Machine Learning and have 10 years of industry experience..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm resize-none"
          />
          <p className="text-xs text-gray-400 text-right">{formData.bio.length}/500</p>
        </div>

        {/* Expertise */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Areas of Expertise
            <span className="text-gray-400 font-normal"> (comma separated)</span>
          </label>
          <input
            type="text"
            name="expertise"
            value={formData.expertise}
            onChange={handleChange}
            placeholder="e.g. Machine Learning, Data Structures, Web Development"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
          {/* Preview tags */}
          {formData.expertise && (
            <div className="flex flex-wrap gap-1 mt-2">
              {formData.expertise.split(",").map((s) => s.trim()).filter(Boolean).map((tag) => (
                <span key={tag} className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Office Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Office Address
          </label>
          <input
            type="text"
            name="officeAddress"
            value={formData.officeAddress}
            onChange={handleChange}
            placeholder="e.g. Room 204, Block A, Chitkara University"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
        </div>

        {/* Visiting Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visiting Hours
          </label>
          <input
            type="text"
            name="visitingHours"
            value={formData.visitingHours}
            onChange={handleChange}
            placeholder="e.g. Mon-Wed: 10am-12pm, Fri: 2pm-4pm"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone / Extension
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="e.g. +91 98765 43210 or Ext. 2045"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
          />
        </div>

        {/* Availability toggle */}
        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Available for Meetings</p>
            <p className="text-xs text-gray-400">
              Turn off to stop students from booking meetings with you
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={handleChange}
              className="sr-only peer"
            />
            {/* Toggle switch styling */}
            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-500 rounded-full peer peer-focus:ring-2 peer-focus:ring-green-300 transition-colors" />
            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow peer-checked:translate-x-5 transition-transform" />
          </label>
        </div>

        {/* Save button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60"
        >
          {loading ? "Saving..." : "💾 Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default FacultyProfileEdit;