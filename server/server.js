// =============================================
// server/server.js — Production-Ready Fix
// =============================================
// FIXES:
// 1. CORS now allows multiple origins (Netlify + localhost)
// 2. MongoDB connection options fixed (removed tlsAllowInvalidCertificates)
// 3. Socket.io CORS matches express CORS
// 4. Added /api/chatbot route (was missing!)
// 5. Health check endpoint for Render keep-alive

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const dotenv     = require("dotenv");
const http       = require("http");
const { Server } = require("socket.io");

dotenv.config();

  if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
    console.error("Missing JWT_SECRET or MONGO_URI");
    process.exit(1);
  }

const authRoutes         = require("./routes/authRoutes");
const facultyRoutes      = require("./routes/facultyRoutes");
const meetingRoutes      = require("./routes/meetingRoutes");
const messageRoutes      = require("./routes/messageRoutes");
const uploadRoutes       = require("./routes/uploadRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const chatbotRoutes      = require("./routes/chatbotRoutes");
const studentRoutes = require("./routes/studentRoutes");

const app    = express();
const server = http.createServer(app);

// ── CORS: allow Netlify URL + localhost ──────
// Add your Netlify URL to SERVER .env as CLIENT_URL
  const allowedOrigins = [
    process.env.CLIENT_URL?.replace(/\/$/, ""),
    "http://localhost:3000",
  ].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, mobile apps, server-to-server)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
  transports: ["websocket", "polling"], // FIX: allow polling fallback for mobile
});

// userId → socketId map — also exposed to controllers via app.get("onlineUsers")
const onlineUsers = new Map();

// Expose io and onlineUsers to controllers
app.set("io", io);
app.set("onlineUsers", onlineUsers);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  // User comes online
  socket.on("user:join", (userId) => {
    if (!userId) return;
    onlineUsers.set(userId.toString(), socket.id);
    console.log(`👤 User ${userId} online`);
    socket.broadcast.emit("user:online", { userId });
  });

  // User opens a conversation room
  socket.on("conversation:join", (conversationId) => {
    if (conversationId) socket.join(conversationId);
  });

  socket.on("conversation:leave", (conversationId) => {
    if (conversationId) socket.leave(conversationId);
  });

  // Relay a sent message to the conversation room
  socket.on("message:send", (data) => {
    if (!data?.conversationId || !data?.message) return;

    // Emit to everyone in the room (receiver sees it instantly)
    io.to(data.conversationId).emit("message:received", data.message);

    // Notify receiver's sidebar even if not in the room
    const receiverSocketId = onlineUsers.get(data.receiverId?.toString());
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("conversation:updated", {
        conversationId: data.conversationId,
        lastMessage:    data.message,
        senderId:       data.senderId,
      });

      // Since receiver is online, emit delivered back to sender immediately
      const senderSocketId = onlineUsers.get(data.senderId?.toString());
      if (senderSocketId) {
        io.to(senderSocketId).emit("message:delivered", {
          messageId:      data.message._id,
          conversationId: data.conversationId,
        });
      }
    }
  });

  // Receiver opened a thread — mark all as read, notify sender
  socket.on("conversation:opened", ({ conversationId, readerId }) => {
    if (conversationId) {
      socket.to(conversationId).emit("messages:read", {
        conversationId,
        readBy: readerId,
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        socket.broadcast.emit("user:offline", { userId });
        break;
      }
    }
    console.log("🔌 Disconnected:", socket.id);
  });
});

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/student", studentRoutes);
// Routes
app.use("/api/auth",         authRoutes);
app.use("/api/faculty",      facultyRoutes);
app.use("/api/meetings",     meetingRoutes);
app.use("/api/messages",     messageRoutes);
app.use("/api/upload",       uploadRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/chatbot",      chatbotRoutes);  // FIX: was missing!

  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(err.status || 500).json({ message: err.message || "Server error" });
  });
  process.on("unhandledRejection", (e) => console.error("Unhandled:", e));

// Health check — Render pings this to keep server alive
app.get("/", (req, res) => res.json({ message: "ChitkaraConnect API running 🚀", status: "ok" }));
app.get("/health", (req, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

const PORT = process.env.PORT || 5000;

// FIX: Removed tlsAllowInvalidCertificates — it can cause random connection drops
// MongoDB Atlas uses valid certificates; that option was causing auth token mismatches
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB failed:", err.message);
    process.exit(1);
  });
