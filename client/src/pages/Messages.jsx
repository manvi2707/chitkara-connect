// =============================================
// Messages.jsx — Inbox + Compose
// Used by both students and faculty
// =============================================

import { useState, useEffect } from "react";
import { getInbox, sendMessage, getAllFaculty } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import MessageCard from "../components/MessageCard";

const Messages = () => {
  const { user } = useAuth();

  const [inbox, setInbox]           = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [facultyList, setFacultyList] = useState([]);

  // Compose form state
  const [composeData, setComposeData] = useState({
    receiverId:    "",
    receiverModel: "Faculty",
    subject:       "",
    body:          "",
  });
  const [sendLoading, setSendLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError]     = useState("");

  // Unread count for the badge
  const unreadCount = inbox.filter((m) => !m.isRead).length;

  // Load inbox messages
  const fetchInbox = async () => {
    try {
      const res = await getInbox();
      setInbox(res.data);
    } catch (err) {
      console.error("Error loading inbox:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load faculty list for compose dropdown (students only)
  const fetchFaculty = async () => {
    if (user?.role === "student") {
      try {
        const res = await getAllFaculty();
        setFacultyList(res.data);
        // Pre-select first faculty
        if (res.data.length > 0) {
          setComposeData((prev) => ({
            ...prev,
            receiverId: res.data[0]._id,
          }));
        }
      } catch (err) {
        console.error("Error loading faculty:", err);
      }
    }
  };

  useEffect(() => {
    fetchInbox();
    fetchFaculty();
  }, []);

  // Handle compose form changes
  const handleComposeChange = (e) => {
    setComposeData({ ...composeData, [e.target.name]: e.target.value });
  };

  // Send new message
  const handleSend = async (e) => {
    e.preventDefault();
    setSendLoading(true);
    setSendError("");

    try {
      await sendMessage(composeData);
      setSendSuccess(true);
      // Reset form
      setComposeData({
        receiverId:    facultyList[0]?._id || "",
        receiverModel: "Faculty",
        subject:       "",
        body:          "",
      });
      fetchInbox(); // refresh inbox
    } catch (err) {
      setSendError(err.response?.data?.message || "Could not send message.");
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            Inbox
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {inbox.length} message{inbox.length !== 1 ? "s" : ""} total
          </p>
        </div>

        {/* Compose button — students only */}
        {user?.role === "student" && (
          <button
            onClick={() => { setShowCompose(!showCompose); setSendSuccess(false); setSendError(""); }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
          >
            ✉️ {showCompose ? "Close" : "Compose"}
          </button>
        )}
      </div>

      {/* Compose form — shown when student clicks Compose */}
      {showCompose && user?.role === "student" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">New Message</h2>

          {sendSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              ✅ Message sent successfully!
            </div>
          )}

          {sendError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              ⚠️ {sendError}
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-4">

            {/* Faculty dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To (Faculty)
              </label>
              <select
                name="receiverId"
                value={composeData.receiverId}
                onChange={handleComposeChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              >
                {facultyList.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} — {f.department} ({f.designation})
                  </option>
                ))}
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={composeData.subject}
                onChange={handleComposeChange}
                required
                maxLength={150}
                placeholder="e.g. Question about Assignment 3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="body"
                value={composeData.body}
                onChange={handleComposeChange}
                required
                rows={5}
                placeholder="Write your message here..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={sendLoading}
                className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-60"
              >
                {sendLoading ? "Sending..." : "Send Message"}
              </button>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inbox */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 animate-bounce">✉️</div>
          <p className="text-gray-500">Loading messages...</p>
        </div>
      ) : inbox.length > 0 ? (
        <div className="space-y-3">
          {inbox.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onRefresh={fetchInbox}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">Your inbox is empty</p>
          {user?.role === "student" && (
            <p className="text-gray-400 text-sm mt-1">
              Click Compose to send your first message to a faculty member
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;