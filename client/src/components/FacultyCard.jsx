// =============================================
// components/FacultyCard.jsx
// =============================================
// Updated: Added "Message" button so students
// can start a conversation from the directory.
// Opening a conversation navigates to the
// Messages tab with that thread pre-selected.

import { useState } from "react";
import { useNavigate }      from "react-router-dom";
import { useAuth }          from "../context/AuthContext";
import { useToast }         from "./Toast";
import { openConversation } from "../utils/api";
import UserAvatar           from "./UserAvatar";
import BookMeetingModal     from "./BookMeetingModal";

const FacultyCard = ({ faculty, onOpenMessages }) => {
  const { user }  = useAuth();
  const toast     = useToast();
  const navigate  = useNavigate();

  const [showModal,   setShowModal]   = useState(false);
  const [msgLoading,  setMsgLoading]  = useState(false);

  // ── Open / create a conversation with this faculty ──
  // If the parent provides onOpenMessages (StudentDashboard does),
  // we call it to switch the active tab to "messages" with pre-selected
  // conversation. Otherwise fall back to navigating to /messages.
  const handleMessage = async () => {
    if (!user) {
      toast.error("Not logged in", "Please log in to send messages.");
      return;
    }
    setMsgLoading(true);
    try {
      const res = await openConversation({
        otherUserId:    faculty._id,
        otherUserModel: "Faculty",
      });
      const conversationId = res.data.conversationId;

      if (onOpenMessages) {
        // Let the parent switch to messages tab + highlight the conversation
        onOpenMessages(conversationId);
      } else {
        // Fallback: navigate to /messages route
        navigate("/messages", { state: { conversationId } });
      }
    } catch (err) {
      toast.error("Could not open chat", "Please try again.");
    } finally {
      setMsgLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition flex flex-col">

        {/* Top section — avatar + name + department */}
        <div className="flex items-center gap-4 mb-4">
          <UserAvatar
            name={faculty.name}
            photo={faculty.profilePhoto}
            role="faculty"
            size="lg"
            shape="rounded"
            className="border-2 border-gray-100 shadow-sm flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-800 truncate">{faculty.name}</h3>
            <p className="text-sm text-gray-500">{faculty.designation}</p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {faculty.department}
            </span>
          </div>
        </div>

        {/* Bio */}
        {faculty.bio && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{faculty.bio}</p>
        )}

        {/* Expertise tags */}
        {faculty.expertise?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {faculty.expertise.map((skill) => (
              <span key={skill}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Office info */}
        <div className="space-y-1 mb-4">
          {faculty.officeAddress && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              📍 {faculty.officeAddress}
            </p>
          )}
          {faculty.visitingHours && (
            <p className="text-xs text-gray-500 flex items-center gap-1">
              🕐 {faculty.visitingHours}
            </p>
          )}
          <p className="text-xs text-gray-500 flex items-center gap-1">
            ✉️ {faculty.email}
          </p>
        </div>

        {/* Spacer so buttons always sit at bottom of card */}
        <div className="flex-1" />

        {/* Bottom row: availability badge + action buttons */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${
            faculty.isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-600"
          }`}>
            {faculty.isAvailable ? "✅ Available" : "❌ Unavailable"}
          </span>

          {/* Action buttons — only shown to logged-in students */}
          {user?.role === "student" && (
            <div className="flex gap-2">
              {/* Message button — always visible */}
              <button
                onClick={handleMessage}
                disabled={msgLoading}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5 rounded-lg transition disabled:opacity-50 flex items-center gap-1"
              >
                {msgLoading ? (
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                ) : "💬"}
                Message
              </button>

              {/* Book Meeting button — only when faculty is available */}
              {faculty.isAvailable && (
                <button
                  onClick={() => setShowModal(true)}
                  className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg transition"
                >
                  📅 Book
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <BookMeetingModal
          faculty={faculty}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default FacultyCard;
