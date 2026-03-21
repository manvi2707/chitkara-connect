// =============================================
// server/controllers/availabilityController.js
// =============================================
// Returns available time slots for a faculty on a given date
// Filters out already-booked slots
// Auto-disables faculty if no slots available for next 7 days

const Meeting = require("../models/Meeting");
const Faculty = require("../models/Faculty");
const { getAvailableSlotsForDate } = require("../utils/timeSlotUtils");

// ── GET AVAILABLE SLOTS ──────────────────────
// GET /api/availability/:facultyId?date=2025-03-26
// Public — student calls this when selecting a date
const getAvailableSlots = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { date } = req.query; // e.g. "2025-03-26"

    if (!date) {
      return res.status(400).json({ message: "Date is required." });
    }

    // Get faculty data including visiting hours
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) {
      return res.status(404).json({ message: "Faculty not found." });
    }

    // Parse the date
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    // Step 1: Get all slots based on visiting hours for this day
    const allSlots = getAvailableSlotsForDate(
      faculty.visitingHours,
      selectedDate
    );

    if (allSlots.length === 0) {
      return res.json({
        availableSlots: [],
        allSlots: [],        // ← FIX: always include allSlots so frontend can detect this case
        bookedSlots: [],
        visitingHours: faculty.visitingHours,
        message: "Faculty has no visiting hours on this day.",
        dayOfWeek: selectedDate.toLocaleDateString("en-IN", { weekday: "long" }),
      });
    }

    // Step 2: Get already-booked slots for this faculty on this date
    // Only accepted and pending meetings block a slot
    const existingMeetings = await Meeting.find({
      faculty: facultyId,
      date: { $gte: selectedDate, $lt: nextDay },
      status: { $in: ["pending", "accepted"] }, // rejected slots are free again
    });

    const bookedSlots = existingMeetings.map((m) => m.timeSlot);

    // Step 3: Filter out booked slots
    const availableSlots = allSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    res.json({
      availableSlots,
      allSlots,
      bookedSlots,
      visitingHours: faculty.visitingHours,
      dayOfWeek: selectedDate.toLocaleDateString("en-IN", { weekday: "long" }),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// ── CHECK AND AUTO-UPDATE AVAILABILITY ───────
// Called after every meeting booking/response
// If faculty has no free slots in next 7 days → auto set isAvailable = false
// If they do have free slots → ensure isAvailable = true
const checkAndUpdateFacultyAvailability = async (facultyId) => {
  try {
    const faculty = await Faculty.findById(facultyId);
    if (!faculty) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let hasAnyFreeSlot = false;

    // Check next 7 days
    for (let i = 0; i < 7; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() + i);

      const nextDay = new Date(checkDate);
      nextDay.setDate(nextDay.getDate() + 1);

      // Get all slots for this day
      const allSlots = getAvailableSlotsForDate(
        faculty.visitingHours,
        checkDate
      );

      if (allSlots.length === 0) continue;

      // Get booked slots for this day
      const bookedMeetings = await Meeting.find({
        faculty: facultyId,
        date: { $gte: checkDate, $lt: nextDay },
        status: { $in: ["pending", "accepted"] },
      });

      const bookedSlots = bookedMeetings.map((m) => m.timeSlot);
      const freeSlots   = allSlots.filter((s) => !bookedSlots.includes(s));

      if (freeSlots.length > 0) {
        hasAnyFreeSlot = true;
        break; // found at least one free slot — no need to check more days
      }
    }

    // Auto update isAvailable based on whether free slots exist
    if (!hasAnyFreeSlot && faculty.isAvailable) {
      await Faculty.findByIdAndUpdate(facultyId, { isAvailable: false });
      console.log(`⚠️ Auto-disabled availability for faculty: ${faculty.name} (no free slots in next 7 days)`);
    } else if (hasAnyFreeSlot && !faculty.isAvailable) {
      await Faculty.findByIdAndUpdate(facultyId, { isAvailable: true });
      console.log(`✅ Auto-enabled availability for faculty: ${faculty.name} (free slots found)`);
    }
  } catch (error) {
    console.error("Error checking faculty availability:", error.message);
  }
};

module.exports = { getAvailableSlots, checkAndUpdateFacultyAvailability };
