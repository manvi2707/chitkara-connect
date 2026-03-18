// =============================================
// components/MessageCard.jsx — With UserAvatar
// =============================================

import { useState } from "react";
import { replyToMessage, markMessageRead } from "../utils/api";
import UserAvatar from "./UserAvatar";

const MessageCard = ({ message, onRefresh }) => {
  const [showReply, setShowReply]   = useState(false);
  const [replyBody, setReplyBody]   = useState("");
  const [loading, setLoading]       = useState(false);
  const [replySent, setReplySent]   = useState(false);
  const [error, setError]           = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpand = async () => {
    setIsExpanded(!isExpanded);
    if (!message.isRead && !isExpanded) {
      try {
        await markMessageRead(message._id);
        onRefresh();
      } catch (err) {
        console.error("Could not mark as read:", err);
      }
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;
    setLoading(true);
    setError("");
    try {
      await replyToMessage(message._id, { body: replyBody });
      setReplySent(true);
      setReplyBody("");
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reply.");
    } finally {
      setLoading(false);
    }
  };

  // Determine sender role for avatar color
  const senderRole = message.senderModel?.toLowerCase() || "student";

  return (
    <div className={`bg-white rounded-xl border shadow-sm transition ${
      message.isRead ? "border-gray-100" : "border-blue-300 shadow-blue-100"
    }`}>

      {/* ── Header — always visible ── */}
      <div
        onClick={handleExpand}
        className="flex items-start justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-xl transition"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">

          {/* Sender avatar — uses UserAvatar */}
          <UserAvatar
            name={message.sender?.name}
            photo={message.sender?.profilePhoto || ""}
            role={senderRole}
            size="md"
            shape="circle"
            className="flex-shrink-0 mt-0.5"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className={`text-sm truncate ${
                message.isRead ? "text-gray-700" : "font-bold text-gray-900"
              }`}>
                {message.sender?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-400 flex-shrink-0">
                {new Date(message.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>

            <p className={`text-sm truncate ${
              message.isRead ? "text-gray-600" : "font-semibold text-gray-800"
            }`}>
              {message.subject}
            </p>

            {!isExpanded && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {message.body}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {!message.isRead && (
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
          )}
          <span className="text-gray-400 text-xs">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* ── Expanded content ── */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <hr className="border-gray-100 mb-3" />

          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">
              <span className="font-medium">From:</span>{" "}
              {message.sender?.name} ({message.sender?.email})
            </p>
            {message.parentMessage && (
              <p className="text-xs text-blue-500">↩ This is a reply</p>
            )}
          </div>

          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
            {message.body}
          </p>

          {!replySent ? (
            <>
              {!showReply ? (
                <button
                  onClick={() => setShowReply(true)}
                  className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
                >
                  ↩ Reply
                </button>
              ) : (
                <form onSubmit={handleReply} className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Reply to {message.sender?.name}:
                  </p>
                  {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                      {error}
                    </div>
                  )}
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={4} required
                    placeholder="Type your reply here..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                  <div className="flex gap-2">
                    <button type="submit" disabled={loading || !replyBody.trim()}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send Reply"}
                    </button>
                    <button type="button"
                      onClick={() => { setShowReply(false); setReplyBody(""); setError(""); }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-green-700 font-medium text-sm">✅ Reply sent successfully!</p>
              <button
                onClick={() => { setReplySent(false); setShowReply(false); }}
                className="text-xs text-green-600 hover:underline mt-1"
              >
                Reply again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageCard;
