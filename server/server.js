// =============================================
// server/server.js — With chatbot route added
// =============================================

const express    = require("express");
const mongoose   = require("mongoose");
const cors       = require("cors");
const dotenv     = require("dotenv");
const http       = require("http");
const { Server } = require("socket.io");

dotenv.config();

const authRoutes         = require("./routes/authRoutes");
const facultyRoutes      = require("./routes/facultyRoutes");
const meetingRoutes      = require("./routes/meetingRoutes");
const messageRoutes      = require("./routes/messageRoutes");
const uploadRoutes       = require("./routes/uploadRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const chatbotRoutes      = require("./routes/chatbotRoutes");
const studentRoutes      = require("./routes/studentRoutes");

const app    = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chitkara-connect.netlify.app",
    methods: ["GET", "POST"],
  },
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
    onlineUsers.set(userId.toString(), socket.id);
    console.log(`👤 User ${userId} online`);

    // Tell all their conversation partners they're online
    socket.broadcast.emit("user:online", { userId });
  });

  // User opens a conversation room
  socket.on("conversation:join", (conversationId) => {
    socket.join(conversationId);
  });

  socket.on("conversation:leave", (conversationId) => {
    socket.leave(conversationId);
  });

  // Relay a sent message to the conversation room
  socket.on("message:send", (data) => {
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
    socket.to(conversationId).emit("messages:read", {
      conversationId,
      readBy: readerId,
    });
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

app.use(cors({
  origin: "https://chitkara-connect.netlify.app",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth",         authRoutes);
app.use("/api/faculty",      facultyRoutes);
app.use("/api/meetings",     meetingRoutes);
app.use("/api/messages",     messageRoutes);
app.use("/api/upload",       uploadRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/chatbot",      chatbotRoutes);
app.use("/api/student",      studentRoutes);

app.get("/", (req, res) => res.json({ message: "ChitkaraConnect API running 🚀" }));

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, { tls: true, tlsAllowInvalidCertificates: true })
  .then(() => {
    console.log("✅ MongoDB connected");
    server.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("❌ MongoDB failed:", err.message);
    process.exit(1);
  });