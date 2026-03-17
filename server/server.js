// =============================================
// server.js — Main Entry Point for the Backend
// =============================================
// This file starts the Express server, connects to MongoDB,
// and registers all the API routes.

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// Import all route files
const authRoutes = require("./routes/authRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const meetingRoutes = require("./routes/meetingRoutes");
const messageRoutes = require("./routes/messageRoutes");

// Create the Express app
const app = express();

// ── Middleware ──────────────────────────────
// Allow requests from the React frontend
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Routes ──────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/messages", messageRoutes);

// A simple test route to check if the server is running
app.get("/", (req, res) => {
  res.json({ message: "ChitkaraConnect API is running! 🚀" });
});

// ── Connect to MongoDB and Start Server ─────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  });