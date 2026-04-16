// =============================================
// client/src/pages/Messages.jsx
// WhatsApp-style chat with delivery + read receipts
// =============================================

import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import {
  getConversations,
  getThreadMessages,
  sendMessage,
  openConversation,
  getAllFaculty,
} from "../utils/api";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "../components/UserAvatar";

// ── Socket singleton ─────────────────────────
let socket;
const getSocket = () => {
  if (!socket) {
    socket = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000", {
      transports: ["websocket"],
    });
  }
  return socket;
};

// ── Timestamp formatter ───────────────────────
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  const now   = new Date();
  const days  = Math.floor((now - date) / 86400000);
  if (days === 0) return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  if (days === 1) return "Yesterday";
  if (days < 7)  return date.toLocaleDateString("en-IN", { weekday: "short" });
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

// ── Tick icon component ───────────────────────
// single grey  ✓  = sent (reached server)
// double grey ✓✓  = delivered (receiver's device got it)
// double blue ✓✓  = read (receiver opened the thread)
const Ticks = ({ msg }) => {
  if (msg.isReadByReceiver) {
    // Blue double ticks — read
    return (
      <span className="inline-flex items-center ml-1" title="Read">
        <svg className="w-3.5 h-3.5 text-blue-400" viewBox="0 0 16 11" fill="currentColor">
          <path d="M11.071.653a.75.75 0 0 1 .025 1.06l-6.5 7a.75.75 0 0 1-1.085 0l-3-3.5a.75.75 0 1 1 1.138-.976L4.5 7.06 10.01.678a.75.75 0 0 1 1.06-.025Z"/>
          <path d="M14.571.653a.75.75 0 0 1 .025 1.06l-6.5 7a.75.75 0 0 1-1.085 0l-.484-.565a.75.75 0 0 1 1.138-.976l.43.5 5.416-5.994a.75.75 0 0 1 1.06-.025Z"/>
        </svg>
      </span>
    );
  }
  if (msg.isDelivered) {
    // Grey double ticks — delivered
    return (
      <span className="inline-flex items-center ml-1" title="Delivered">
        <svg className="w-3.5 h-3.5 text-gray-400" viewBox="0 0 16 11" fill="currentColor">
          <path d="M11.071.653a.75.75 0 0 1 .025 1.06l-6.5 7a.75.75 0 0 1-1.085 0l-3-3.5a.75.75 0 1 1 1.138-.976L4.5 7.06 10.01.678a.75.75 0 0 1 1.06-.025Z"/>
          <path d="M14.571.653a.75.75 0 0 1 .025 1.06l-6.5 7a.75.75 0 0 1-1.085 0l-.484-.565a.75.75 0 0 1 1.138-.976l.43.5 5.416-5.994a.75.75 0 0 1 1.06-.025Z"/>
        </svg>
      </span>
    );
  }
  // Single grey tick — sent
  return (
    <span className="inline-flex items-center ml-1" title="Sent">
      <svg className="w-3 h-3 text-gray-400" viewBox="0 0 16 11" fill="currentColor">
        <path d="M14.071.653a.75.75 0 0 1 .025 1.06l-9 9.5a.75.75 0 0 1-1.096 0l-3-3.5a.75.75 0 1 1 1.138-.976L4.5 9.56 13.01.678a.75.75 0 0 1 1.06-.025Z"/>
      </svg>
    </span>
  );
};

// ── ConversationItem (sidebar row) ───────────
const ConversationItem = ({ convo, isActive, onClick }) => {
  const lastMsg = convo.lastMessage;
  const preview = lastMsg?.body
    ? lastMsg.body.length > 40 ? lastMsg.body.slice(0, 40) + "…" : lastMsg.body
    : "No messages yet";

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left border-b border-gray-100 hover:bg-blue-50 ${
        isActive ? "bg-blue-50 border-l-4 border-l-blue-600" : "border-l-4 border-l-transparent"
      }`}
    >
      <div className="relative flex-shrink-0">
        <UserAvatar
          name={convo.otherUser?.name}
          photo={convo.otherUser?.profilePhoto || ""}
          role={convo.otherUser?.role || "faculty"}
          size="md"
          shape="circle"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <p className={`text-sm truncate ${convo.unreadCount > 0 ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
            {convo.otherUser?.name || "Unknown"}
          </p>
          <p className="text-xs text-gray-400 flex-shrink-0 ml-2">
            {lastMsg ? formatTime(lastMsg.createdAt) : ""}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <p className={`text-xs truncate ${convo.unreadCount > 0 ? "text-gray-700 font-medium" : "text-gray-400"}`}>
            {preview}
          </p>
          {convo.unreadCount > 0 && (
            <span className="ml-2 flex-shrink-0 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {convo.unreadCount > 9 ? "9+" : convo.unreadCount}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

// ── MessageBubble ─────────────────────────────
const MessageBubble = ({ msg, isOwn }) => (
  <div className={`flex items-end gap-2 mb-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
    {!isOwn && (
      <UserAvatar
        name={msg.sender?.name}
        photo={msg.sender?.profilePhoto || ""}
        role={msg.senderModel?.toLowerCase() || "faculty"}
        size="sm"
        shape="circle"
        className="flex-shrink-0 mb-1"
      />
    )}

    <div className={`max-w-[70%] sm:max-w-[60%] flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
      <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
        isOwn
          ? "bg-blue-600 text-white rounded-br-sm"
          : "bg-white text-gray-800 border border-gray-100 rounded-bl-sm"
      }`}>
        {msg.body}
      </div>

      <div className="flex items-center gap-0.5 mt-1 px-1">
        <p className="text-[10px] text-gray-400">
          {new Date(msg.createdAt).toLocaleTimeString("en-IN", {
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
        {/* Only show ticks on messages I sent */}
        {isOwn && <Ticks msg={msg} />}
      </div>
    </div>
  </div>
);

// ── Main Messages Page ────────────────────────
const Messages = ({ onUnreadChange, initialConversationId }) => {
  const { user } = useAuth();

  const [conversations,    setConversations]    = useState([]);
  const [activeConvo,      setActiveConvo]      = useState(null);
  const [messages,         setMessages]         = useState([]);
  const [messageText,      setMessageText]      = useState("");
  const [loading,          setLoading]          = useState(true);
  const [msgLoading,       setMsgLoading]       = useState(false);
  const [sending,          setSending]          = useState(false);
  const [showNewChat,      setShowNewChat]      = useState(false);
  const [facultyList,      setFacultyList]      = useState([]);
  const [showMobileThread, setShowMobileThread] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const prevMsgCount   = useRef(0);
  const activeConvoRef = useRef(null); // keep socket handlers up to date

  // Keep ref in sync with state
  useEffect(() => { activeConvoRef.current = activeConvo; }, [activeConvo]);

  // ── Auto-open conversation from Faculty Directory ──
  // When student clicks "Message" on a FacultyCard, StudentDashboard
  // switches to this tab AND passes the conversationId. We wait until
  // conversations have loaded, then open the right thread automatically.
  useEffect(() => {
  if (!initialConversationId || conversations.length === 0) return;
  const target = conversations.find((c) => c._id === initialConversationId);
  if (target) {
    openThread(target);
    setShowMobileThread(true);
  }
}, [initialConversationId, conversations]);

  // ── Scroll on new messages ───────────────────
  useEffect(() => {
    if (messages.length > prevMsgCount.current) {
      messagesEndRef.current?.scrollIntoView({
        behavior: prevMsgCount.current === 0 ? "instant" : "smooth",
      });
    }
    prevMsgCount.current = messages.length;
  }, [messages]);

  // ── Total unread count → notify parent (Sidebar badge) ──
  useEffect(() => {
    const total = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
    onUnreadChange?.(total);
  }, [conversations, onUnreadChange]);

  // ── Socket setup ─────────────────────────────
  useEffect(() => {
    if (!user) return;
    const s = getSocket();
    const myId = (user.id || user._id)?.toString();
    s.emit("user:join", myId);

    // New message arrives in active thread
    s.on("message:received", (newMsg) => {
      const convoId = newMsg.conversation?._id || newMsg.conversation;

      setMessages((prev) => {
        if (prev.find((m) => m._id === newMsg._id)) return prev;
        return [...prev, newMsg];
      });

      setConversations((prev) =>
        prev.map((c) => c._id === convoId ? { ...c, lastMessage: newMsg } : c)
      );

      // If we're in this thread, immediately emit read receipt
      if (activeConvoRef.current?._id === convoId) {
        s.emit("conversation:opened", { conversationId: convoId, readerId: myId });
      }
    });

    // Sidebar update for a different thread
    s.on("conversation:updated", ({ conversationId, lastMessage, senderId }) => {
      setConversations((prev) =>
        prev.map((c) =>
          c._id === conversationId
            ? {
                ...c,
                lastMessage,
                unreadCount: senderId !== myId
                  ? (c.unreadCount || 0) + 1
                  : c.unreadCount,
              }
            : c
        )
      );
    });

    // Single message delivered (receiver came online)
    s.on("message:delivered", ({ messageId, conversationId }) => {
      setMessages((prev) =>
        prev.map((m) => m._id === messageId ? { ...m, isDelivered: true } : m)
      );
    });

    // Batch delivered — receiver fetched conversations (came online)
    s.on("messages:delivered", ({ receiverId }) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.receiver?.toString() === receiverId || m.receiver === receiverId
            ? { ...m, isDelivered: true }
            : m
        )
      );
    });

    // All messages in a thread were read by the other person
    s.on("messages:read", ({ conversationId }) => {
      if (activeConvoRef.current?._id === conversationId) {
        setMessages((prev) =>
          prev.map((m) => ({ ...m, isDelivered: true, isReadByReceiver: true }))
        );
      }
    });

    return () => {
      s.off("message:received");
      s.off("conversation:updated");
      s.off("message:delivered");
      s.off("messages:delivered");
      s.off("messages:read");
    };
  }, [user]);

  // ── Fetch conversations ───────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getConversations();
        setConversations(res.data);
      } catch (err) {
        console.error("Error loading conversations:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Fetch faculty for new chat ────────────────
  useEffect(() => {
    if (user?.role === "student") {
      getAllFaculty().then((res) => setFacultyList(res.data)).catch(console.error);
    }
  }, [user]);

  // ── Open a thread ─────────────────────────────
  const openThread = async (convo) => {
    setActiveConvo(convo);
    setShowMobileThread(true);
    setMsgLoading(true);
    setMessages([]);
    prevMsgCount.current = 0;

    const s = getSocket();
    s.emit("conversation:join", convo._id);

    try {
      const res = await getThreadMessages(convo._id);
      setMessages(res.data);

      // Reset unread in sidebar
      setConversations((prev) =>
        prev.map((c) => c._id === convo._id ? { ...c, unreadCount: 0 } : c)
      );

      // Notify sender that we read their messages
      const myId = (user?.id || user?._id)?.toString();
      s.emit("conversation:opened", { conversationId: convo._id, readerId: myId });
    } catch (err) {
      console.error("Error loading messages:", err);
    } finally {
      setMsgLoading(false);
    }

    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // ── Start new chat ────────────────────────────
  const startNewChat = async (faculty) => {
    setShowNewChat(false);
    const existing = conversations.find(
      (c) => c.otherUser?._id === faculty._id || c.otherUser?.id === faculty._id
    );
    if (existing) { openThread(existing); return; }

    try {
      const res = await openConversation({ otherUserId: faculty._id, otherUserModel: "Faculty" });
      const newConvo = {
        _id:         res.data.conversationId,
        otherUser:   { ...faculty, role: "faculty" },
        lastMessage:  null,
        unreadCount:  0,
        updatedAt:    new Date().toISOString(),
      };
      setConversations((prev) => [newConvo, ...prev]);
      openThread(newConvo);
    } catch (err) {
      console.error("Error creating conversation:", err);
    }
  };

  // ── Send message ──────────────────────────────
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeConvo || sending) return;

    const text = messageText.trim();
    setMessageText("");
    setSending(true);

    const myId = user?.id || user?._id;

    // Optimistic message — single tick (sent)
    const optimistic = {
      _id:             "temp-" + Date.now(),
      conversation:    activeConvo._id,
      body:            text,
      sender:          { _id: myId, name: user.name, profilePhoto: user.profilePhoto },
      senderModel:     user.role === "student" ? "Student" : "Faculty",
      receiver:        activeConvo.otherUser._id,
      createdAt:       new Date().toISOString(),
      isDelivered:     false,
      isReadByReceiver: false,
    };
    setMessages((prev) => [...prev, optimistic]);

    try {
      const res = await sendMessage({
        receiverId:    activeConvo.otherUser._id,
        receiverModel: activeConvo.otherUser.role === "faculty" ? "Faculty" : "Student",
        body:          text,
      });

      const realMsg = res.data.data;

      // Replace optimistic with real (may already have isDelivered:true if receiver online)
      setMessages((prev) =>
        prev.map((m) => (m._id === optimistic._id ? realMsg : m))
      );

      // Emit to socket room
      const s = getSocket();
      s.emit("message:send", {
        conversationId: activeConvo._id,
        receiverId:     activeConvo.otherUser._id,
        senderId:       myId?.toString(),
        message:        realMsg,
      });

      // Update sidebar last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConvo._id
            ? { ...c, lastMessage: realMsg, updatedAt: new Date().toISOString() }
            : c
        )
      );
    } catch (err) {
      console.error("Error sending:", err);
      setMessages((prev) => prev.filter((m) => m._id !== optimistic._id));
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(e); }
  };

  const myId = user?.id || user?._id;

  // ── Render ────────────────────────────────────
  return (
    <div className="flex overflow-hidden bg-gray-50 h-full">

      {/* ── LEFT: Conversation list ── */}
      <div className={`
        flex flex-col bg-white border-r border-gray-200
        w-full sm:w-80 flex-shrink-0
        ${showMobileThread ? "hidden sm:flex" : "flex"}
      `}>
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-900">Messages</h1>
          {user?.role === "student" && (
            <button
              onClick={() => setShowNewChat(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg transition"
              title="New chat"
            >
              ✏️
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex flex-col gap-3 p-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 bg-gray-100 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : conversations.length > 0 ? (
            conversations.map((convo) => (
              <ConversationItem
                key={convo._id}
                convo={convo}
                isActive={activeConvo?._id === convo._id}
                onClick={() => openThread(convo)}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center px-4">
              <div className="text-5xl mb-3">💬</div>
              <p className="text-gray-600 font-medium">No conversations yet</p>
              {user?.role === "student" && (
                <p className="text-gray-400 text-sm mt-1">Tap ✏️ to message a faculty</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT: Thread view ── */}
      <div className={`flex-1 flex flex-col ${showMobileThread ? "flex" : "hidden sm:flex"}`}>
        {activeConvo ? (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200 shadow-sm">
              <button
                onClick={() => {
                  setShowMobileThread(false);
                  setActiveConvo(null);
                  const s = getSocket();
                  s.emit("conversation:leave", activeConvo._id);
                }}
                className="sm:hidden text-blue-600 mr-1 text-lg"
              >←</button>

              <UserAvatar
                name={activeConvo.otherUser?.name}
                photo={activeConvo.otherUser?.profilePhoto || ""}
                role={activeConvo.otherUser?.role || "faculty"}
                size="md"
                shape="circle"
              />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{activeConvo.otherUser?.name}</p>
                <p className="text-xs text-gray-400 capitalize">
                  {activeConvo.otherUser?.role}
                  {activeConvo.otherUser?.department ? ` · ${activeConvo.otherUser.department}` : ""}
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
              {msgLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-gray-400 animate-pulse text-sm">Loading messages…</div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="text-4xl mb-3">👋</div>
                  <p className="text-gray-500 font-medium text-sm">Start the conversation!</p>
                  <p className="text-gray-400 text-xs mt-1">Say hi to {activeConvo.otherUser?.name}</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg._id}
                      msg={msg}
                      isOwn={
                        msg.sender?._id?.toString() === myId?.toString() ||
                        msg.sender?._id === myId
                      }
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 px-4 py-3">
              <form onSubmit={handleSend} className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${activeConvo.otherUser?.name}…`}
                  rows={1}
                  className="flex-1 resize-none border border-gray-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition max-h-32 overflow-y-auto"
                  style={{ minHeight: "42px" }}
                />
                <button
                  type="submit"
                  disabled={!messageText.trim() || sending}
                  className="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {sending ? (
                    <span className="text-xs">…</span>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                  )}
                </button>
              </form>
              <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
                Press Enter to send · Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-gray-700 font-semibold text-lg">Your Messages</h2>
            <p className="text-gray-400 text-sm mt-2 max-w-xs">
              Select a conversation from the left, or start a new one by tapping ✏️
            </p>
          </div>
        )}
      </div>

      {/* ── New Chat Modal ── */}
      {showNewChat && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={() => setShowNewChat(false)}
        >
          <div
            className="bg-white rounded-2xl w-full sm:w-96 max-h-[70vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">New Message</h2>
              <button onClick={() => setShowNewChat(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>
            <p className="text-xs text-gray-400 px-5 pt-3 pb-1 font-medium uppercase tracking-wide">Choose a faculty</p>
            <div className="overflow-y-auto flex-1 pb-2">
              {facultyList.map((f) => (
                <button
                  key={f._id}
                  onClick={() => startNewChat(f)}
                  className="w-full flex items-center gap-3 px-5 py-3 hover:bg-blue-50 transition text-left"
                >
                  <UserAvatar name={f.name} photo={f.profilePhoto || ""} role="faculty" size="md" shape="circle" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{f.name}</p>
                    <p className="text-xs text-gray-400 truncate">{f.department}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Messages;