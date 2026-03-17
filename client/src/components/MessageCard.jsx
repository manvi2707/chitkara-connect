// =============================================
// MessageCard.jsx — Single message card
// Used in Messages.jsx for both student and faculty
// Shows message details + reply option
// =============================================

import { useState } from "react";
import { replyToMessage, markMessageRead } from "../utils/api";

const MessageCard = ({ message, onRefresh }) => {
  const [showReply, setShowReply]     = useState(false);
  const [replyBody, setReplyBody]     = useState("");
  const [loading, setLoading]         = useState(false);
  const [replySent, setReplySent]     = useState(false);
  const [error, setError]             = useState("");
  const [isExpanded, setIsExpanded]   = useState(false);

  // ── Mark as read when user expands the message ──
  const handleExpand = async () => {
    setIsExpanded(!isExpanded);

    // Only call API if message is currently unread
    if (!message.isRead && !isExpanded) {
      try {
        await markMessageRead(message._id);
        onRefresh(); // tell parent to refresh so unread count updates
      } catch (err) {
        console.error("Could not mark as read:", err);
      }
    }
  };

  // ── Send reply ───────────────────────────────
  const handleReply = async (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;

    setLoading(true);
    setError("");

    try {
      await replyToMessage(message._id, { body: replyBody });
      setReplySent(true);   // show success state
      setReplyBody("");      // clear the textarea
      onRefresh();           // refresh inbox
    } catch (err) {
      setError(err.response?.data?.message || "Could not send reply.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border shadow-sm transition ${
        message.isRead
          ? "border-gray-100"
          : "border-blue-300 shadow-blue-100" // unread messages have blue border
      }`}
    >
      {/* ── Message Header — always visible ── */}
      <div
        onClick={handleExpand}
        className="flex items-start justify-between p-4 cursor-pointer hover:bg-gray-50 rounded-xl transition"
      >
        <div className="flex items-start gap-3 flex-1 min-w-0">

          {/* Sender avatar */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
            {message.sender?.name?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="flex-1 min-w-0">
            {/* Sender name + time */}
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <p className={`text-sm truncate ${message.isRead ? "text-gray-700" : "font-bold text-gray-900"}`}>
                {message.sender?.name || "Unknown"}
              </p>
              <p className="text-xs text-gray-400 flex-shrink-0">
                {new Date(message.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            {/* Subject line */}
            <p className={`text-sm truncate ${message.isRead ? "text-gray-600" : "font-semibold text-gray-800"}`}>
              {message.subject}
            </p>

            {/* Preview of body — only show when collapsed */}
            {!isExpanded && (
              <p className="text-xs text-gray-400 truncate mt-0.5">
                {message.body}
              </p>
            )}
          </div>
        </div>

        {/* Unread dot + expand arrow */}
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {!message.isRead && (
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
          )}
          <span className="text-gray-400 text-xs">
            {isExpanded ? "▲" : "▼"}
          </span>
        </div>
      </div>

      {/* ── Expanded Content ─────────────────── */}
      {isExpanded && (
        <div className="px-4 pb-4">

          {/* Divider */}
          <hr className="border-gray-100 mb-3" />

          {/* Sender details */}
          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-xs text-gray-500 mb-1">
              <span className="font-medium">From:</span> {message.sender?.name} ({message.sender?.email})
            </p>
            {message.parentMessage && (
              <p className="text-xs text-blue-500">↩ This is a reply</p>
            )}
          </div>

          {/* Full message body */}
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
            {message.body}
          </p>

          {/* Reply section */}
          {!replySent ? (
            <>
              {/* Toggle reply box */}
              {!showReply ? (
                <button
                  onClick={() => setShowReply(true)}
                  className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition"
                >
                  ↩ Reply
                </button>
              ) : (
                // Reply form
                <form onSubmit={handleReply} className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">
                    Reply to {message.sender?.name}:
                  </p>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-sm">
                      {error}
                    </div>
                  )}

                  {/* Reply textarea */}
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={4}
                    required
                    placeholder="Type your reply here..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  />

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={loading || !replyBody.trim()}
                      className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg text-sm font-medium transition disabled:opacity-60"
                    >
                      {loading ? "Sending..." : "Send Reply"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowReply(false);
                        setReplyBody("");
                        setError("");
                      }}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-lg text-sm transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            // Success state after reply sent
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
              <p className="text-green-700 font-medium text-sm">✅ Reply sent successfully!</p>
              <button
                onClick={() => {
                  setReplySent(false);
                  setShowReply(false);
                }}
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