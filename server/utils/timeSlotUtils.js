// =============================================
// server/utils/timeSlotUtils.js — Improved
// =============================================
// Handles all common visiting hours formats:
// "Mon-Wed: 10am-12pm"
// "Mon-Wed: 10:00am-12:00pm"
// "Monday-Friday: 9am-5pm"
// "Mon, Wed, Fri: 10am-12pm"
// "Mon-Wed: 10am-12pm, Fri: 2pm-4pm"

const DAY_MAP = {
  sun: 0, sunday:    0,
  mon: 1, monday:    1,
  tue: 2, tuesday:   2,
  wed: 3, wednesday: 3,
  thu: 4, thursday:  4,
  fri: 5, friday:    5,
  sat: 6, saturday:  6,
};

// Convert time string to minutes since midnight
// Handles: "10am", "10:30am", "2pm", "14:00", "10:00am"
const parseTimeToMinutes = (str) => {
  if (!str) return null;
  str = str.trim().toLowerCase().replace(/\s/g, "");

  // 24hr: "14:00"
  let m = str.match(/^(\d{1,2}):(\d{2})$/);
  if (m) return parseInt(m[1]) * 60 + parseInt(m[2]);

  // 12hr with minutes: "10:30am", "2:30pm"
  m = str.match(/^(\d{1,2}):(\d{2})(am|pm)$/);
  if (m) {
    let h = parseInt(m[1]);
    const min = parseInt(m[2]);
    if (m[3] === "pm" && h !== 12) h += 12;
    if (m[3] === "am" && h === 12) h = 0;
    return h * 60 + min;
  }

  // 12hr no minutes: "10am", "2pm"
  m = str.match(/^(\d{1,2})(am|pm)$/);
  if (m) {
    let h = parseInt(m[1]);
    if (m[2] === "pm" && h !== 12) h += 12;
    if (m[2] === "am" && h === 12) h = 0;
    return h * 60;
  }

  return null;
};

// Minutes to "H:MM AM/PM"
const minutesToTime = (mins) => {
  let h   = Math.floor(mins / 60);
  const m = mins % 60;
  const ampm = h >= 12 ? "PM" : "AM";
  if (h > 12) h -= 12;
  if (h === 0) h = 12;
  return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
};

// Generate 30-min slots between startMins and endMins
const generateSlots = (startMins, endMins) => {
  const slots = [];
  let cur = startMins;
  while (cur + 30 <= endMins) {
    slots.push(`${minutesToTime(cur)} - ${minutesToTime(cur + 30)}`);
    cur += 30;
  }
  return slots;
};

// Parse "Mon", "Monday", "mon" → day number
const parseSingleDay = (str) => {
  const key = str.trim().toLowerCase();
  return DAY_MAP[key] ?? DAY_MAP[key.substring(0, 3)] ?? null;
};

// Parse day expression into array of day numbers
// Handles: "Mon", "Mon-Wed", "Mon,Wed,Fri"
const parseDays = (dayStr) => {
  dayStr = dayStr.trim();

  // Comma-separated: "Mon, Wed, Fri"
  if (dayStr.includes(",")) {
    return dayStr
      .split(",")
      .map((d) => parseSingleDay(d.trim()))
      .filter((d) => d !== null);
  }

  // Range: "Mon-Wed"
  if (dayStr.includes("-")) {
    const parts = dayStr.split("-");
    const start = parseSingleDay(parts[0]);
    const end   = parseSingleDay(parts[1]);
    if (start === null || end === null) return [];
    const days = [];
    for (let d = start; d <= end; d++) days.push(d);
    return days;
  }

  // Single day: "Mon"
  const d = parseSingleDay(dayStr);
  return d !== null ? [d] : [];
};

// ── MAIN EXPORT ──────────────────────────────
// Given visiting hours string + a date object
// Returns array of 30-min time slot strings for that day
const getAvailableSlotsForDate = (visitingHours, date) => {
  // No visiting hours → return empty (not a default)
  if (!visitingHours || !visitingHours.trim()) return [];

  const dayOfWeek = new Date(date).getDay(); // 0=Sun
  const allSlots  = [];

  // Split into segments by comma, but be careful:
  // "Mon-Wed: 10am-12pm, Fri: 2pm-4pm"
  // We split ONLY on commas that are followed by a day name
  // Simple approach: split by comma, then re-join if no colon follows
  const rawSegments = visitingHours.split(",");
  const segments    = [];
  let   buffer      = "";

  for (const seg of rawSegments) {
    const combined = buffer ? buffer + "," + seg : seg;
    // A valid segment has a colon separating days from times
    if (combined.includes(":")) {
      segments.push(combined.trim());
      buffer = "";
    } else {
      buffer = combined;
    }
  }
  if (buffer) segments.push(buffer.trim());

  for (const segment of segments) {
    if (!segment) continue;

    // Split on first colon to separate day part from time part
    const colonIdx = segment.indexOf(":");
    if (colonIdx === -1) continue;

    const dayPart  = segment.substring(0, colonIdx).trim();
    const timePart = segment.substring(colonIdx + 1).trim();

    // Check if this day matches
    const days = parseDays(dayPart);
    if (!days.includes(dayOfWeek)) continue;

    // Parse time range — format: "10am-12pm" or "10:30am-12:00pm"
    // Split by " - " or "-" between time tokens
    // Strategy: find the hyphen that separates start from end
    // by looking for pattern: (time)(-)( time)
    const timeRangeMatch = timePart.match(
      /^(\d{1,2}(?::\d{2})?(?:am|pm)?)\s*[-–]\s*(\d{1,2}(?::\d{2})?(?:am|pm)?)$/i
    );

    if (!timeRangeMatch) {
      console.log("Could not parse time range:", timePart);
      continue;
    }

    const startMins = parseTimeToMinutes(timeRangeMatch[1]);
    const endMins   = parseTimeToMinutes(timeRangeMatch[2]);

    if (startMins === null || endMins === null) continue;
    if (startMins >= endMins) continue;

    const slots = generateSlots(startMins, endMins);
    allSlots.push(...slots);
  }

  // Remove duplicates (in case of overlapping schedules)
  return [...new Set(allSlots)];
};

module.exports = {
  getAvailableSlotsForDate,
  generateSlots,
  parseTimeToMinutes,
  minutesToTime,
};
