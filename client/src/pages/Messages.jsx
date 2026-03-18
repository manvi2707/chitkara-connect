// =============================================
// pages/Messages.jsx — Mobile Fixed
// =============================================

import { useState, useEffect } from "react";
import { getInbox, sendMessage, getAllFaculty } from "../utils/api";
import { useAuth } from "../context/AuthContext";
import MessageCard from "../components/MessageCard";

const Messages = () => {
  const { user } = useAuth();

  const [inbox, setInbox]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [facultyList, setFacultyList] = useState([]);
  const [sendLoading, setSendLoading] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [sendError, setSendError]     = useState("");

  const [composeData, setComposeData] = useState({
    receiverId: "", receiverModel: "Faculty", subject: "", body: "",
  });

  const unreadCount = inbox.filter((m) => !m.isRead).length;

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

  const fetchFaculty = async () => {
    if (user?.role === "student") {
      try {
        const res = await getAllFaculty();
        setFacultyList(res.data);
        if (res.data.length > 0) {
          setComposeData((prev) => ({ ...prev, receiverId: res.data[0]._id }));
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

  const handleComposeChange = (e) => {
    setComposeData({ ...composeData, [e.target.name]: e.target.value });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    setSendLoading(true);
    setSendError("");
    try {
      await sendMessage(composeData);
      setSendSuccess(true);
      setComposeData({
        receiverId: facultyList[0]?._id || "",
        receiverModel: "Faculty",
        subject: "", body: "",
      });
      fetchInbox();
    } catch (err) {
      setSendError(err.response?.data?.message || "Could not send message.");
    } finally {
      setSendLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 w-full overflow-x-hidden">

      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            Inbox
            {unreadCount > 0 && (
              <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {inbox.length} message{inbox.length !== 1 ? "s" : ""}
          </p>
        </div>

        {user?.role === "student" && (
          <button
            onClick={() => { setShowCompose(!showCompose); setSendSuccess(false); setSendError(""); }}
            className="bg-blue-700 hover:bg-blue-800 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5"
          >
            ✉️ <span className="hidden sm:inline">Compose</span>
            <span className="sm:hidden">{showCompose ? "Close" : "New"}</span>
          </button>
        )}
      </div>

      {/* Compose form */}
      {showCompose && user?.role === "student" && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-5">
          <h2 className="font-semibold text-gray-800 mb-3 text-sm">New Message</h2>

          {sendSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-lg mb-3 text-sm">
              ✅ Message sent!
            </div>
          )}
          {sendError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg mb-3 text-sm">
              ⚠️ {sendError}
            </div>
          )}

          <form onSubmit={handleSend} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">To</label>
              <select name="receiverId" value={composeData.receiverId}
                onChange={handleComposeChange} required
                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm outline-none transition"
              >
                {facultyList.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.name} — {f.department}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Subject</label>
              <input type="text" name="subject" value={composeData.subject}
                onChange={handleComposeChange} required maxLength={150}
                placeholder="e.g. Question about Assignment 3"
                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Message</label>
              <textarea name="body" value={composeData.body}
                onChange={handleComposeChange} required rows={4}
                placeholder="Write your message here..."
                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm outline-none transition resize-none"
              />
            </div>

            <div className="flex gap-2">
              <button type="submit" disabled={sendLoading}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-60"
              >
                {sendLoading ? "Sending..." : "Send"}
              </button>
              <button type="button" onClick={() => setShowCompose(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm transition"
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
            <MessageCard key={message._id} message={message} onRefresh={fetchInbox} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">Your inbox is empty</p>
          {user?.role === "student" && (
            <p className="text-gray-400 text-sm mt-1">
              Tap Compose to send your first message
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
