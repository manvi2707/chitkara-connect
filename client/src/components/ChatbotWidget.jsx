// =============================================
// client/src/components/ChatbotWidget.jsx — DRAGGABLE + SMART POSITION + FULLSCREEN
// =============================================

import { useState, useRef, useEffect, useCallback } from "react";
import API from "../utils/api";
import BookMeetingModal from "./BookMeetingModal";

const QUICK_SUGGESTIONS = [
  "I need help with my project",
  "Who teaches Machine Learning?",
  "How do I book a meeting?",
  "I have a DBMS problem",
  "Which faculty handles placements?",
];

const nowTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

// ── Typing indicator ─────────────────────────
const TypingIndicator = () => (
  <div className="flex justify-start mb-3 items-end gap-2">
    <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold">
      AI
    </div>
    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
      <div className="flex gap-1 items-center h-3">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150" />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-300" />
      </div>
    </div>
  </div>
);

// ── Faculty card ─────────────────────────────
const FacultyRecommendationCard = ({ faculty, reason, onBookMeeting }) => (
  <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm mt-2">
    <div className="flex items-start gap-2.5">
      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
        {faculty.profilePhoto ? (
          <img
            src={faculty.profilePhoto}
            alt={faculty.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <span className="text-blue-700 font-bold text-sm">
            {faculty.name?.charAt(0)}
          </span>
        )}
      </div>

      <div className="flex-1">
        <p className="font-semibold text-sm">{faculty.name}</p>
        <p className="text-xs text-gray-500">
          {faculty.designation} · {faculty.department}
        </p>
      </div>
    </div>

    {reason && (
      <p className="text-xs text-gray-500 mt-2 italic border-t pt-2">
        💡 {reason}
      </p>
    )}

    <div className="flex gap-2 mt-2">
      <button
        onClick={() => onBookMeeting(faculty)}
        className="flex-1 bg-blue-700 text-white text-xs py-1.5 rounded-lg"
      >
        📅 Book
      </button>
      <a
        href={`mailto:${faculty.email}`}
        className="flex-1 text-center border text-xs py-1.5 rounded-lg"
      >
        ✉️ Email
      </a>
    </div>
  </div>
);

// ── Message bubble ───────────────────────────
const MessageBubble = ({ msg, onBookMeeting }) => {
  const isBot = msg.sender === "bot";

  return (
    <div className={`flex mb-3 ${isBot ? "justify-start" : "justify-end"}`}>
      <div className="max-w-[78%]">
        <div
          className={`px-3 py-2 text-sm whitespace-pre-wrap rounded-2xl ${
            isBot
              ? "bg-white border text-gray-800"
              : "bg-blue-700 text-white"
          }`}
        >
          {msg.text}
        </div>

        {isBot &&
          msg.facultyCards?.map((rec) =>
            rec.faculty ? (
              <FacultyRecommendationCard
                key={rec.faculty._id}
                faculty={rec.faculty}
                reason={rec.reason}
                onBookMeeting={onBookMeeting}
              />
            ) : null
          )}

        <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ───────────────────────────
const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [bookingFaculty, setBookingFaculty] = useState(null);

  const [position, setPosition] = useState({ x: 24, y: 24 });

  const [chatPosition, setChatPosition] = useState({ top: 100, left: 100 });

  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const hasDragged = useRef(false);
  const buttonRef = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // ── Auto scroll ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ── Welcome message ──
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          sender: "bot",
          text:
            "👋 Hi! I'm ChitkaraBot.\n\nTell me your problem and I’ll suggest the right faculty.",
          time: nowTime(),
        },
      ]);
    }
  }, [isOpen]);

  // ── SMART POSITIONING ──
  const calculateChatPosition = () => {
    const btn = buttonRef.current?.getBoundingClientRect();
    if (!btn) return;

    const w = 360;
    const h = 500;
    const pad = 12;

    const right = window.innerWidth - btn.right;
    const left = btn.left;
    const bottom = window.innerHeight - btn.bottom;

    let x, y;

    if (right > w + pad) x = btn.right + pad;
    else x = btn.left - w - pad;

    if (bottom > h) y = btn.bottom - h;
    else y = Math.max(pad, btn.top - h);

    x = Math.max(pad, Math.min(x, window.innerWidth - w - pad));
    y = Math.max(pad, Math.min(y, window.innerHeight - h - pad));

    setChatPosition({ top: y, left: x });
  };

  // ── DRAG HANDLERS ──
  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    hasDragged.current = false;

    const rect = buttonRef.current.getBoundingClientRect();

    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };

    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;

    hasDragged.current = true;

    const x =
      window.innerWidth - e.clientX + dragOffset.current.x - 56;
    const y =
      window.innerHeight - e.clientY + dragOffset.current.y - 56;

    setPosition({
      x: Math.max(8, Math.min(x, window.innerWidth - 64)),
      y: Math.max(8, Math.min(y, window.innerHeight - 64)),
    });
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  // ── OPEN/CLOSE ──
  const handleButtonClick = () => {
    if (!hasDragged.current) {
      setIsOpen((prev) => {
        const next = !prev;
        if (!prev) setTimeout(calculateChatPosition, 0);
        return next;
      });
    }
  };

  // ── SEND MESSAGE ──
  const sendMessage = async (text) => {
    const msg = (text || input).trim();
    if (!msg || isTyping) return;

    setInput("");
    setShowSuggestions(false);

    setMessages((p) => [
      ...p,
      { id: Date.now(), sender: "student", text: msg, time: nowTime() },
    ]);

    setIsTyping(true);

    try {
      const res = await API.post("/chatbot/chat", { message: msg });

      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: res.data.message,
          time: nowTime(),
          facultyCards:
            res.data.type === "faculty_recommendation"
              ? res.data.recommendedFaculty
              : [],
        },
      ]);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "⚠️ Error connecting to server",
          time: nowTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const chatStyle = isFullScreen
    ? {
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
      }
    : {
        top: chatPosition.top,
        left: chatPosition.left,
        width: "360px",
        height: "500px",
      };

  return (
    <>
      {bookingFaculty && (
        <BookMeetingModal
          faculty={bookingFaculty}
          onClose={() => setBookingFaculty(null)}
        />
      )}

      {/* Floating button */}
      <button
        ref={buttonRef}
        onMouseDown={onMouseDown}
        onClick={handleButtonClick}
        className="fixed z-50 w-14 h-14 bg-blue-700 text-white rounded-full shadow-2xl flex items-center justify-center"
        style={{ bottom: position.y, right: position.x }}
      >
        {isOpen ? "✕" : "🤖"}
      </button>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white flex flex-col border shadow-2xl ${
            isFullScreen ? "" : "rounded-2xl"
          }`}
          style={chatStyle}
        >
          {/* HEADER */}
          <div className="bg-blue-700 text-white flex justify-between p-3">
            <div>
              <p className="font-bold">ChitkaraBot</p>
              <p className="text-xs text-blue-200">AI Assistant</p>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setIsFullScreen((v) => !v)}>
                ⤢
              </button>
              <button onClick={() => setIsOpen(false)}>✕</button>
            </div>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-3 bg-gray-50">
            {messages.map((m) => (
              <MessageBubble
                key={m.id}
                msg={m}
                onBookMeeting={setBookingFaculty}
              />
            ))}

            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT */}
          <div className="p-2 border-t">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage()
              }
              className="w-full border p-2 rounded-lg"
              placeholder="Type message..."
            />

            <button
              onClick={() => sendMessage()}
              className="w-full mt-2 bg-blue-700 text-white py-2 rounded-lg"
            >
              Send
            </button>

            <p className="text-xs text-center text-gray-400 mt-1">
              Powered by Gemini AI
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;