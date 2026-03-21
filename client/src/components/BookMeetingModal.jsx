// =============================================
// components/BookMeetingModal.jsx
// =============================================
// Smart meeting booking with:
// ✅ Loads slots based on faculty visiting hours
// ✅ Filters out already-booked slots
// ✅ Continuous multi-slot selection (e.g. 1 hour = 2 slots)
// ✅ Non-continuous selection auto-deselects previous

import { useState } from "react";
import { bookMeeting, getAvailableSlots } from "../utils/api";
import { useToast } from "./Toast";

const BookMeetingModal = ({ faculty, onClose }) => {
  const toast = useToast();

  const [date, setDate]                   = useState("");
  const [reason, setReason]               = useState("");
  const [loading, setLoading]             = useState(false);
  const [slotsLoading, setSlotsLoading]   = useState(false);
  const [success, setSuccess]             = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [bookedSlots, setBookedSlots]     = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  // selectedSlots = array of consecutive slot strings
  // e.g. ["10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM"]
  const [slotsInfo, setSlotsInfo]         = useState(null);
  const [dateSelected, setDateSelected]   = useState(false);

  // ── Today for min date ───────────────────
  const today = new Date().toISOString().split("T")[0];

  // ── Fetch slots when date changes ────────
  const handleDateChange = async (e) => {
    const selectedDate = e.target.value;
    setDate(selectedDate);
    setSelectedSlots([]);
    setAvailableSlots([]);
    setBookedSlots([]);
    setSlotsInfo(null);
    setDateSelected(false);

    if (!selectedDate) return;

    setSlotsLoading(true);
    try {
      const res = await getAvailableSlots(faculty._id, selectedDate);
      const data = res.data;

      // Ensure allSlots is always an array even if backend omitted it
      const normalized = {
        ...data,
        allSlots:    data.allSlots    || [],
        bookedSlots: data.bookedSlots || [],
      };

      setAvailableSlots(normalized.availableSlots || []);
      setBookedSlots(normalized.bookedSlots);
      setSlotsInfo(normalized);
      setDateSelected(true);
    } catch (err) {
      toast.error("Could not load slots", "Please try again.");
    } finally {
      setSlotsLoading(false);
    }
  };

  // ── Handle slot click ─────────────────────
  // Logic:
  // 1. If slot already selected → deselect it and all after it
  // 2. If no slots selected → select this one
  // 3. If this slot is right after last selected → extend selection
  // 4. If this slot is NOT consecutive → reset and select only this one
  const handleSlotClick = (slot) => {
    const idx = availableSlots.indexOf(slot);

    // Case 1: Clicking an already-selected slot → deselect from here onwards
    if (selectedSlots.includes(slot)) {
      const clickedAt = selectedSlots.indexOf(slot);
      setSelectedSlots(selectedSlots.slice(0, clickedAt));
      return;
    }

    // Case 2: No slots selected yet → just select this one
    if (selectedSlots.length === 0) {
      setSelectedSlots([slot]);
      return;
    }

    // Find index of last selected slot in availableSlots
    const lastSelected     = selectedSlots[selectedSlots.length - 1];
    const lastSelectedIdx  = availableSlots.indexOf(lastSelected);

    // Case 3: This slot is RIGHT after the last selected → extend
    if (idx === lastSelectedIdx + 1) {
      setSelectedSlots([...selectedSlots, slot]);
      return;
    }

    // Case 4: Non-consecutive → reset and select only this one
    setSelectedSlots([slot]);
  };

  // ── Get combined time slot label ──────────
  // e.g. ["10:00 AM - 10:30 AM", "10:30 AM - 11:00 AM"]
  // becomes "10:00 AM - 11:00 AM"
  const getCombinedTimeSlot = () => {
    if (selectedSlots.length === 0) return "";
    if (selectedSlots.length === 1) return selectedSlots[0];

    // Get start time from first slot, end time from last slot
    const firstSlot = selectedSlots[0];
    const lastSlot  = selectedSlots[selectedSlots.length - 1];

    const startTime = firstSlot.split(" - ")[0];
    const endTime   = lastSlot.split(" - ")[1];

    return `${startTime} - ${endTime}`;
  };

  // ── Get duration label ────────────────────
  const getDurationLabel = () => {
    const count = selectedSlots.length;
    if (count === 0) return "";
    const totalMins = count * 30;
    if (totalMins < 60) return `${totalMins} minutes`;
    const hours = Math.floor(totalMins / 60);
    const mins  = totalMins % 60;
    if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours}h ${mins}m`;
  };

  // ── Submit booking ────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSlots.length === 0) {
      toast.error("No slot selected", "Please select at least one time slot.");
      return;
    }

    setLoading(true);
    try {
      // Book each slot separately in the backend
      // So each slot is properly marked as booked
      for (const slot of selectedSlots) {
        await bookMeeting({
          facultyId: faculty._id,
          date,
          timeSlot:  slot,
          reason,
        });
      }
      setSuccess(true);
    } catch (err) {
      toast.error(
        "Booking failed",
        err.response?.data?.message || "Could not book meeting."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── Slot status helper ────────────────────
  const getSlotStatus = (slot) => {
    if (bookedSlots.includes(slot))    return "booked";
    if (selectedSlots.includes(slot))  return "selected";
    return "available";
  };

  const combinedSlot  = getCombinedTimeSlot();
  const durationLabel = getDurationLabel();

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto">

        {/* ── Header ── */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Book Meeting</h2>
            <p className="text-sm text-gray-500">with {faculty.name}</p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition text-sm">
            ✕
          </button>
        </div>

        {/* ── Success state ── */}
        {success ? (
          <div className="p-8 text-center">
            <div className="text-5xl mb-3">✅</div>
            <p className="text-green-700 font-bold text-lg mb-1">
              {selectedSlots.length > 1 ? "Meetings Booked!" : "Request Sent!"}
            </p>
            <p className="text-gray-500 text-sm mb-1">
              {faculty.name} will review your request.
            </p>
            <div className="bg-gray-50 rounded-xl p-3 mt-3 mb-5 text-left">
              <p className="text-xs text-gray-500">
                📅 {new Date(date).toLocaleDateString("en-IN", {
                  weekday: "long", day: "numeric", month: "long", year: "numeric"
                })}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                🕐 {combinedSlot}
                {durationLabel && (
                  <span className="ml-1 text-blue-600">({durationLabel})</span>
                )}
              </p>
              {selectedSlots.length > 1 && (
                <p className="text-xs text-blue-500 mt-1">
                  📋 {selectedSlots.length} slots booked
                </p>
              )}
            </div>
            <button onClick={onClose}
              className="bg-blue-700 text-white px-8 py-2.5 rounded-xl hover:bg-blue-800 transition font-semibold">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-5">

            {/* Visiting hours info */}
            {faculty.visitingHours && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-blue-700 mb-1">🕐 Visiting Hours</p>
                <p className="text-sm text-blue-800">{faculty.visitingHours}</p>
              </div>
            )}

            {/* Date picker */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                required
                min={today}
                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>

            {/* Time slots section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700">
                  Select Time Slot
                </label>
                {selectedSlots.length > 0 && (
                  <button type="button" onClick={() => setSelectedSlots([])}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline">
                    Clear
                  </button>
                )}
              </div>

              {/* Loading */}
              {slotsLoading && (
                <div className="border-2 border-gray-100 rounded-xl p-5 text-center">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Checking availability...</p>
                </div>
              )}

              {/* No date selected */}
              {!slotsLoading && !dateSelected && (
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center">
                  <p className="text-2xl mb-1">📅</p>
                  <p className="text-sm text-gray-400">Select a date to see available slots</p>
                </div>
              )}

              {/* No visiting hours */}
              {!slotsLoading && dateSelected && !faculty.visitingHours && (
                <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-yellow-700 mb-1">
                    ⚠️ No visiting hours set
                  </p>
                  <p className="text-xs text-yellow-600">
                    Contact faculty directly at {faculty.email}
                  </p>
                </div>
              )}

              {/* No hours this day */}
              {!slotsLoading && dateSelected && slotsInfo?.allSlots?.length === 0 && (
                <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-orange-700 mb-1">
                    📅 No hours on {slotsInfo?.dayOfWeek}
                  </p>
                  <p className="text-xs text-orange-600">
                    Try a different date.
                    {faculty.visitingHours && ` Available: ${faculty.visitingHours}`}
                  </p>
                </div>
              )}

              {/* All slots booked */}
              {!slotsLoading && dateSelected &&
               slotsInfo?.allSlots?.length > 0 && availableSlots.length === 0 && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-red-700 mb-2">
                    ❌ Fully booked on {slotsInfo?.dayOfWeek}
                  </p>
                  <p className="text-xs text-red-600 mb-2">
                    All slots are taken. Try another date.
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {slotsInfo.allSlots.map((slot) => (
                      <span key={slot}
                        className="text-xs bg-red-100 text-red-400 px-2 py-0.5 rounded-full line-through opacity-70">
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Slot grid ── */}
              {!slotsLoading && dateSelected && availableSlots.length > 0 && (
                <div>
                  {/* Hint */}
                  <p className="text-xs text-gray-400 mb-3 bg-gray-50 rounded-lg px-3 py-2">
                    💡 Tap one slot for 30 min. Tap the next slot to extend.
                    Tapping a non-consecutive slot will reset your selection.
                  </p>

                  {/* All slots — available + booked together in order */}
                  <div className="grid grid-cols-2 gap-2">
                    {slotsInfo.allSlots.map((slot) => {
                      const status = getSlotStatus(slot);
                      const isBooked   = status === "booked";
                      const isSelected = status === "selected";

                      // Is this the first or last in selected range?
                      const isFirst = selectedSlots[0] === slot;
                      const isLast  = selectedSlots[selectedSlots.length - 1] === slot;

                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => handleSlotClick(slot)}
                          className={`
                            relative px-3 py-2.5 rounded-xl text-xs font-semibold
                            border-2 transition-all duration-150
                            ${isBooked
                              ? "bg-gray-100 text-gray-300 border-gray-100 cursor-not-allowed line-through"
                              : isSelected
                              ? "bg-blue-600 text-white border-blue-600 shadow-md scale-105"
                              : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:bg-blue-50"
                            }
                          `}
                        >
                          {slot}
                          {/* Booked label */}
                          {isBooked && (
                            <span className="absolute -top-1.5 -right-1.5 bg-red-400 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-xs leading-none">
                              ✗
                            </span>
                          )}
                          {/* Start/end indicators for multi-slot */}
                          {isSelected && selectedSlots.length > 1 && isFirst && (
                            <span className="absolute -top-1.5 -left-1.5 bg-green-500 text-white text-xs rounded-full px-1">
                              start
                            </span>
                          )}
                          {isSelected && selectedSlots.length > 1 && isLast && (
                            <span className="absolute -top-1.5 -right-1.5 bg-green-500 text-white text-xs rounded-full px-1">
                              end
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Available count */}
                  <p className="text-xs text-gray-400 mt-2 text-center">
                    {availableSlots.length} slot{availableSlots.length !== 1 ? "s" : ""} available
                    {bookedSlots.length > 0 && ` · ${bookedSlots.length} booked`}
                  </p>
                </div>
              )}

              {/* ── Selected summary ── */}
              {selectedSlots.length > 0 && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 mt-3">
                  <p className="text-xs font-semibold text-blue-700 mb-1">
                    ✅ Selected: {durationLabel}
                  </p>
                  <p className="text-sm font-bold text-blue-900">
                    {combinedSlot}
                  </p>
                  {selectedSlots.length > 1 && (
                    <p className="text-xs text-blue-500 mt-1">
                      {selectedSlots.length} consecutive slots selected
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Reason */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Reason for Meeting
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                maxLength={300}
                placeholder="e.g. Need help with final year project topic selection..."
                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {reason.length}/300
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || selectedSlots.length === 0}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/20"
            >
              {loading
                ? "Sending..."
                : selectedSlots.length === 0
                ? "Select a time slot first"
                : selectedSlots.length === 1
                ? "Send Meeting Request (30 min)"
                : `Send Meeting Request (${durationLabel})`
              }
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookMeetingModal;
