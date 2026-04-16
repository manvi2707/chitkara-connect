// =============================================
// components/MeetingCard.jsx
// =============================================
// Updated: toast notifications on accept/reject,
// proper error handling (no silent console.error)

import { useState }          from "react";
import { respondToMeeting }  from "../utils/api";
import { useToast }          from "./Toast";
import UserAvatar            from "./UserAvatar";

const MeetingCard = ({ meeting, role, onStatusChange }) => {
  const toast = useToast();

  const [loading,     setLoading]     = useState(false);
  const [note,        setNote]        = useState("");
  const [showNoteBox, setShowNoteBox] = useState(false);
  const [actionType,  setActionType]  = useState("");

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

  // ── Step 1: Faculty clicks Accept or Reject ───
  // Just shows the note textarea + Confirm button
  const handleAction = (type) => {
    setActionType(type);
    setShowNoteBox(true);
  };

  // ── Step 2: Faculty confirms with optional note ─
  const confirmAction = async () => {
    setLoading(true);
    try {
      await respondToMeeting(meeting._id, {
        status:      actionType,
        facultyNote: note,
      });

      // ── Show appropriate toast ─────────────
      if (actionType === "accepted") {
        toast.success(
          "Meeting Accepted ✅",
          "The student will be notified by email."
        );
      } else {
        toast.info(
          "Meeting Rejected",
          "The student will be notified by email."
        );
      }

      onStatusChange(); // re-fetch the meetings list
    } catch (err) {
      toast.error(
        "Action failed",
        err.response?.data?.message || "Could not update meeting. Please try again."
      );
    } finally {
      setLoading(false);
      setShowNoteBox(false);
      setNote("");
    }
  };

  // Person displayed depends on whose dashboard this is
  const person     = role === "student" ? meeting.faculty : meeting.student;
  const personRole = role === "student" ? "faculty" : "student";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">

      {/* ── Top row: avatar + name + status badge ── */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
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
        <span className={`text-xs px-3 py-1 rounded-full font-medium flex-shrink-0 ${statusStyle[meeting.status]}`}>
          {statusIcon[meeting.status]}{" "}
          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
        </span>
      </div>

      {/* ── Meeting details ── */}
      <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-1">
        <p className="text-sm text-gray-600">
          📅{" "}
          <span className="font-medium">
            {new Date(meeting.date).toLocaleDateString("en-IN", {
              weekday: "long", year: "numeric", month: "long", day: "numeric",
            })}
          </span>
        </p>
        <p className="text-sm text-gray-600">
          🕐 <span className="font-medium">{meeting.timeSlot}</span>
        </p>
        <p className="text-sm text-gray-600">📝 {meeting.reason}</p>
      </div>

      {/* ── Faculty note (if set) ── */}
      {meeting.facultyNote && (
        <div className="bg-blue-50 rounded-lg p-3 mb-3">
          <p className="text-xs text-blue-600 font-medium mb-1">Faculty Note:</p>
          <p className="text-sm text-blue-800">{meeting.facultyNote}</p>
        </div>
      )}

      {/* ── Email notification hint for student ── */}
      {role === "student" && meeting.status === "pending" && (
        <p className="text-xs text-gray-400 mb-2">
          📧 You'll receive an email when this is reviewed.
        </p>
      )}

      {/* ── Faculty action buttons (pending meetings only) ── */}
      {role === "faculty" && meeting.status === "pending" && (
        <div>
          {!showNoteBox ? (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleAction("accepted")}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                ✅ Accept
              </button>
              <button
                onClick={() => handleAction("rejected")}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium transition"
              >
                ❌ Reject
              </button>
            </div>
          ) : (
            <div className="mt-2 space-y-2">
              {/* Which action is being confirmed */}
              <p className="text-sm text-gray-600 font-medium">
                {actionType === "accepted" ? "✅ Accepting" : "❌ Rejecting"}{" "}
                — Add note (optional):
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder={
                  actionType === "accepted"
                    ? "e.g. Please bring your project report..."
                    : "e.g. I'm out of office that day..."
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
              />
              <p className="text-xs text-gray-400">
                📧 The student will receive an email notification.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={confirmAction}
                  disabled={loading}
                  className={`flex-1 text-white py-2 rounded-lg text-sm font-medium transition disabled:opacity-60 ${
                    actionType === "accepted"
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                      </svg>
                      Saving...
                    </span>
                  ) : "Confirm"}
                </button>
                <button
                  onClick={() => { setShowNoteBox(false); setNote(""); }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg text-sm transition"
                >
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
