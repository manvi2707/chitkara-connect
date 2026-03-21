// =============================================
// server/routes/availabilityRoutes.js
// =============================================

const express = require("express");
const router  = express.Router();
const { getAvailableSlots } = require("../controllers/availabilityController");

// GET available slots for a faculty on a specific date
// URL: /api/availability/:facultyId?date=2025-03-26
// Public — no auth needed (student picks date before logging in too)
router.get("/:facultyId", getAvailableSlots);

module.exports = router;
