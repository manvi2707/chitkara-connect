// =============================================
// components/MeetingCard.jsx — With UserAvatar
// =============================================

import { useState } from "react";
import { respondToMeeting } from "../utils/api";
import UserAvatar from "./UserAvatar";

const MeetingCard = ({ meeting, role, onStatusChange }) => {
  const [loading, setLoading]       = useState(false);
  const [note, setNote]             = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [actionType, setActionType] = useState("");

  const statusStyle = {
    pending:  "bg-yellow-100 text-yellow-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-600",
  };

  const statusIcon = {
    pending:  "⏳",
    accepted: "✅",
    rejected: "❌",
  };

  const handleAction = (type) => {
    setActionType(type);
    setShowNoteBox(true);
  };

  const confirmAction = async () => {
    setLoading(true);
    try {
      await respondToMeeting(meeting._id, { status: actionType, facultyNote: note });
      onStatusChange();
    } catch (err) {
      console.error("Error responding to meeting:", err);
    } finally {
      setLoading(false);
      setShowNoteBox(false);
    }
  };

  // Person to show depends on role
  const person = role === "student" ? meeting.faculty : meeting.student;
  const personRole = role === "student" ? "faculty" : "student";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">

      {/* Top row */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          {/* UserAvatar shows real photo */}
          <UserAvatar
            name={person?.name}
            photo={person?.profilePhoto || ""}
            role={personRole}
            size="md"
            shape="rounded"
          />
          <div>
            <p className="font-semibold text-gray-800">{person?.name}</p>
            {role === "student" ? (
              <p className="text-sm text-gray-500">
                {meeting.faculty?.department} · {meeting.faculty?.designation}
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                {meeting.student?.department} · Year {meeting.student?.year}
              </p>
            )}
          </div>
        </div>

        {/* Status badge */}
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusStyle[meeting.status]}`}>
          {statusIcon[meeting.status]}{" "}
          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
        </span>
      </div>

      {/* Meeting details */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
        <p className="text-sm text-gray-600">
          📅 <span className="font-medium">
            {new Date(meeting.date).toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric"
            })}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          🕐 <span className="font-medium">{meeting.timeSlot}</span>
        </p>
        <p className="text-sm text-gray-600">📝 {meeting.reason}</p>
      </div>

      {/* Faculty note */}
      {meeting.facultyNote && (
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-blue-600 font-medium mb-1">Faculty Note:</p>
          <p className="text-sm text-blue-800">{meeting.facultyNote}</p>
        </div>
      )}

      {/* Faculty action buttons */}
      {role === "faculty" && meeting.status === "pending" && (
        <div>
          {!showNoteBox ? (
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleAction("accepted")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition">
                ✅ Accept
              </button>
              <button onClick={() => handleAction("rejected")}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition">
                ❌ Reject
              </button>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-gray-600 font-medium">
                {actionType === "accepted" ? "✅ Accepting" : "❌ Rejecting"} — Add note (optional):
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="e.g. Please bring your project report..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <div className="flex gap-2">
                <button onClick={confirmAction} disabled={loading}
                  className={`flex-1 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60 ${
                    actionType === "accepted" ? "bg-green-600 hover:bg-green-700" : "bg-red-500 hover:bg-red-600"
                  }`}>
                  {loading ? "Saving..." : "Confirm"}
                </button>
                <button onClick={() => setShowNoteBox(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm transition">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MeetingCard;
