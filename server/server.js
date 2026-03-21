// =============================================
// server/server.js — Updated with availability
// =============================================

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const dotenv     = require("dotenv");

dotenv.config();

const authRoutes         = require("./routes/authRoutes");
const facultyRoutes      = require("./routes/facultyRoutes");
const meetingRoutes      = require("./routes/meetingRoutes");
const messageRoutes      = require("./routes/messageRoutes");
const uploadRoutes       = require("./routes/uploadRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes"); // ← NEW

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth",         authRoutes);
app.use("/api/faculty",      facultyRoutes);
app.use("/api/meetings",     meetingRoutes);
app.use("/api/messages",     messageRoutes);
app.use("/api/upload",       uploadRoutes);
app.use("/api/availability", availabilityRoutes); // ← NEW

app.get("/", (req, res) => {
  res.json({ message: "ChitkaraConnect API is running! 🚀" });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  })
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
