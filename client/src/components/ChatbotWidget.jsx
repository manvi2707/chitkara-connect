// =============================================
// client/src/components/ChatbotWidget.jsx — DRAGGABLE
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

// ── Typing dots ──────────────────────────────
const TypingIndicator = () => (
  <div className="flex justify-start mb-3 items-end gap-2">
    <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
      AI
    </div>
    <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
      <div className="flex gap-1 items-center h-3">
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  </div>
);

// ── Faculty card inside chat ─────────────────
const FacultyRecommendationCard = ({ faculty, reason, onBookMeeting }) => (
  <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-sm mt-2">
    <div className="flex items-start gap-2.5">
      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {faculty.profilePhoto ? (
          <img src={faculty.profilePhoto} alt={faculty.name} className="w-full h-full object-cover rounded-full" />
        ) : (
          <span className="text-blue-700 font-bold text-sm">
            {faculty.name?.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{faculty.name}</p>
        <p className="text-xs text-gray-500">{faculty.designation} · {faculty.department}</p>
        {faculty.expertise?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {faculty.expertise.slice(0, 3).map((exp) => (
              <span key={exp} className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full">
                {exp}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
    {reason && (
      <p className="text-xs text-gray-500 mt-2 italic border-t border-gray-100 pt-2">
        💡 {reason}
      </p>
    )}
    {faculty.visitingHours && (
      <p className="text-xs text-gray-500 mt-1">🕐 {faculty.visitingHours}</p>
    )}
    <div className="flex gap-2 mt-2">
      <button
        onClick={() => onBookMeeting(faculty)}
        className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-xs py-1.5 rounded-lg font-semibold transition"
      >
        📅 Book Meeting
      </button>
      <a
        href={`mailto:${faculty.email}`}
        className="flex-1 text-center border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs py-1.5 rounded-lg font-semibold transition"
      >
        ✉️ Email
      </a>
    </div>
  </div>
);

// ── Single message bubble ────────────────────
const MessageBubble = ({ msg, onBookMeeting }) => {
  const isBot = msg.sender === "bot";
  return (
    <div className={`flex mb-3 items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}>
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          AI
        </div>
      )}
      <div className="max-w-[78%]">
        <div
          className={`px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
            isBot
              ? "bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-bl-sm shadow-sm"
              : "bg-blue-700 text-white rounded-2xl rounded-br-sm"
          }`}
        >
          {msg.text}
        </div>
        {isBot && msg.facultyCards?.length > 0 &&
          msg.facultyCards.map((rec) =>
            rec.faculty ? (
              <FacultyRecommendationCard
                key={rec.faculty._id}
                faculty={rec.faculty}
                reason={rec.reason}
                onBookMeeting={onBookMeeting}
              />
            ) : null
          )}
        <p className={`text-xs mt-1 ${isBot ? "text-gray-400" : "text-blue-300 text-right"}`}>
          {msg.time}
        </p>
      </div>
    </div>
  );
};

// ── Main Widget ──────────────────────────────
const ChatbotWidget = () => {
  const [isOpen, setIsOpen]                   = useState(false);
  const [messages, setMessages]               = useState([]);
  const [input, setInput]                     = useState("");
  const [isTyping, setIsTyping]               = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [bookingFaculty, setBookingFaculty]   = useState(null);
  const [hasNewMessage, setHasNewMessage]     = useState(false);

  // ── Drag state ───────────────────────────────
  const [position, setPosition] = useState({ x: 24, y: 24 }); // distance from bottom-right
  const isDragging   = useRef(false);
  const dragOffset   = useRef({ x: 0, y: 0 });
  const hasDragged   = useRef(false);           // to distinguish click vs drag
  const buttonRef    = useRef(null);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // On open: show welcome message once
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
      setTimeout(() => inputRef.current?.focus(), 150);
      if (messages.length === 0) {
        setMessages([{
          id: 1,
          sender: "bot",
          text: "👋 Hi! I'm ChitkaraBot.\n\nDescribe your problem or what you need help with — I'll suggest the right faculty for you!",
          time: nowTime(),
        }]);
      }
    }
  }, [isOpen]);

  // ── Drag handlers ────────────────────────────
  const onMouseDown = useCallback((e) => {
    // Only drag on the button itself, not child elements like close button inside chat
    isDragging.current = true;
    hasDragged.current = false;

    // Current button position from right/bottom edge
    const btnRect = buttonRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - btnRect.left,
      y: e.clientY - btnRect.top,
    };

    e.preventDefault();
  }, []);

  const onMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    hasDragged.current = true;

    const newX = window.innerWidth  - e.clientX + dragOffset.current.x - 56; // 56 = button width
    const newY = window.innerHeight - e.clientY + dragOffset.current.y - 56;

    // Clamp so button stays on screen
    setPosition({
      x: Math.max(8, Math.min(newX, window.innerWidth  - 64)),
      y: Math.max(8, Math.min(newY, window.innerHeight - 64)),
    });
  }, []);

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Touch support
  const onTouchStart = useCallback((e) => {
    const touch = e.touches[0];
    isDragging.current = true;
    hasDragged.current = false;
    const btnRect = buttonRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: touch.clientX - btnRect.left,
      y: touch.clientY - btnRect.top,
    };
  }, []);

  const onTouchMove = useCallback((e) => {
    if (!isDragging.current) return;
    hasDragged.current = true;
    const touch = e.touches[0];

    const newX = window.innerWidth  - touch.clientX + dragOffset.current.x - 56;
    const newY = window.innerHeight - touch.clientY + dragOffset.current.y - 56;

    setPosition({
      x: Math.max(8, Math.min(newX, window.innerWidth  - 64)),
      y: Math.max(8, Math.min(newY, window.innerHeight - 64)),
    });

    e.preventDefault(); // prevent page scroll while dragging
  }, []);

  const onTouchEnd = useCallback(() => {
    isDragging.current = false;
  }, []);

  // Attach global mouse/touch move+up listeners
  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend",  onTouchEnd);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup",   onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend",  onTouchEnd);
    };
  }, [onMouseMove, onMouseUp, onTouchMove, onTouchEnd]);

  const handleButtonClick = () => {
    // Only toggle if it was a click, not end of a drag
    if (!hasDragged.current) {
      setIsOpen((v) => !v);
    }
  };

  // ── Chat window position (opens above/left of button) ──
  const chatStyle = {
    bottom: `${position.y + 64}px`,  // 64 = button height + gap
    right:  `${position.x}px`,
    width:  "360px",
    height: "500px",
    maxWidth:  "calc(100vw - 32px)",
    maxHeight: "calc(100vh - 110px)",
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isTyping) return;

    setShowSuggestions(false);
    setInput("");

    const studentMsg = { id: Date.now(), sender: "student", text: trimmed, time: nowTime() };
    setMessages((prev) => [...prev, studentMsg]);
    setIsTyping(true);

    try {
      const res = await API.post("/chatbot/chat", { message: trimmed });
      const data = res.data;

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: data.message || "I received your message!",
          time: nowTime(),
          facultyCards: data.type === "faculty_recommendation" ? (data.recommendedFaculty || []) : [],
        },
      ]);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Connection failed";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: `⚠️ ${errMsg}`,
          time: nowTime(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {bookingFaculty && (
        <BookMeetingModal faculty={bookingFaculty} onClose={() => setBookingFaculty(null)} />
      )}

      {/* Floating draggable button */}
      <button
        ref={buttonRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onClick={handleButtonClick}
        className="fixed z-50 w-14 h-14 bg-blue-700 hover:bg-blue-800 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors duration-200 cursor-grab active:cursor-grabbing select-none"
        style={{ bottom: `${position.y}px`, right: `${position.x}px` }}
        title="ChitkaraBot — drag to move"
      >
        {isOpen ? <span className="text-lg font-bold">✕</span> : <span className="text-2xl">🤖</span>}
        {hasNewMessage && !isOpen && (
          <span className="absolute top-0.5 right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={chatStyle}
        >
          {/* Header */}
          <div className="flex-shrink-0 bg-blue-700 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              🤖
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm">ChitkaraBot</p>
              <p className="text-blue-200 text-xs">AI Faculty Assistant</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/10 transition flex-shrink-0"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto px-3 py-3 bg-gray-50"
            style={{ minHeight: 0 }}
          >
            {messages.map((msg) => (
              <MessageBubble key={msg.id} msg={msg} onBookMeeting={setBookingFaculty} />
            ))}

            {isTyping && <TypingIndicator />}

            {showSuggestions && messages.length <= 1 && (
              <div className="mt-3">
                <p className="text-xs text-gray-400 mb-2 text-center">Try asking:</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      className="text-xs bg-white border border-blue-200 text-blue-700 px-2.5 py-1 rounded-full hover:bg-blue-50 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex-shrink-0 px-3 py-2.5 border-t border-gray-100 bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Describe your problem..."
                disabled={isTyping}
                className="flex-1 border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2 text-sm outline-none transition disabled:bg-gray-50 disabled:cursor-wait"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-300 text-white rounded-xl flex items-center justify-center transition flex-shrink-0"
              >
                {isTyping ? (
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1 text-center">Powered by Gemini AI</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;