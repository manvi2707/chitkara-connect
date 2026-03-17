// =============================================
// BookMeetingModal.jsx — Popup to book a meeting
// Opens when student clicks "Book Meeting" on a faculty card
// =============================================

import { useState } from "react";
import { bookMeeting } from "../utils/api";

// Available time slots student can choose from
const TIME_SLOTS = [
  "09:00 AM - 09:30 AM",
  "09:30 AM - 10:00 AM",
  "10:00 AM - 10:30 AM",
  "10:30 AM - 11:00 AM",
  "11:00 AM - 11:30 AM",
  "11:30 AM - 12:00 PM",
  "02:00 PM - 02:30 PM",
  "02:30 PM - 03:00 PM",
  "03:00 PM - 03:30 PM",
  "03:30 PM - 04:00 PM",
];

const BookMeetingModal = ({ faculty, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: TIME_SLOTS[0],
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await bookMeeting({
        facultyId: faculty._id,
        date: formData.date,
        timeSlot: formData.timeSlot,
        reason: formData.reason,
      });
      setSuccess(true); // show success message
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    // Dark overlay behind the modal
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Book Meeting with {faculty.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Success state */}
        {success ? (
          <div className="text-center py-6">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-700 font-semibold text-lg">Request Sent!</p>
            <p className="text-gray-500 text-sm mt-1">
              {faculty.name} will review your request soon.
            </p>
            <button
              onClick={onClose}
              className="mt-4 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
            >
              Close
            </button>
          </div>
        ) : (
          // Booking form
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error message */}
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm">
                {error}
              </div>
            )}

            {/* Date picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                // Prevent selecting past dates
                min={new Date().toISOString().split("T")[0]}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Time slot dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time Slot
              </label>
              <select
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {TIME_SLOTS.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))}
              </select>
            </div>

            {/* Reason text area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Meeting
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
                rows={3}
                maxLength={300}
                placeholder="e.g. Need help with final year project topic selection..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <p className="text-xs text-gray-400 text-right">
                {formData.reason.length}/300
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-lg font-semibold transition disabled:opacity-60"
            >
              {loading ? "Sending Request..." : "Send Meeting Request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookMeetingModal;