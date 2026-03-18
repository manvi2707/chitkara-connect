// =============================================
// pages/Meetings.jsx — Mobile Fixed
// =============================================

import { useState, useEffect } from "react";
import { getMyMeetings, getFacultyMeetings } from "../utils/api";
import MeetingCard from "../components/MeetingCard";

const Meetings = ({ role }) => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState("all");

  const fetchMeetings = async () => {
    setLoading(true);
    try {
      const res = role === "student"
        ? await getMyMeetings()
        : await getFacultyMeetings();
      setMeetings(res.data);
    } catch (err) {
      console.error("Error fetching meetings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMeetings(); }, [role]);

  const filtered = filter === "all"
    ? meetings
    : meetings.filter((m) => m.status === filter);

  const counts = {
    all:      meetings.length,
    pending:  meetings.filter((m) => m.status === "pending").length,
    accepted: meetings.filter((m) => m.status === "accepted").length,
    rejected: meetings.filter((m) => m.status === "rejected").length,
  };

  return (
    <div className="p-4 sm:p-6 w-full overflow-x-hidden">

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {role === "student" ? "My Meetings" : "Meeting Requests"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {role === "student"
            ? "Track all your meeting requests"
            : "Review and respond to requests"}
        </p>
      </div>

      {/* Filter tabs — scrollable on mobile */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
        {["all", "pending", "accepted", "rejected"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              filter === status
                ? "bg-blue-700 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status === "pending"  && "⏳"}
            {status === "accepted" && "✅"}
            {status === "rejected" && "❌"}
            {status === "all"      && "📋"}
            <span className="capitalize">{status}</span>
            {counts[status] > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filter === status ? "bg-white/20" : "bg-gray-300"
              }`}>
                {counts[status]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 animate-bounce">📅</div>
          <p className="text-gray-500">Loading meetings...</p>
        </div>
      ) : filtered.length > 0 ? (
        <div className="space-y-4">
          {filtered.map((meeting) => (
            <MeetingCard
              key={meeting._id}
              meeting={meeting}
              role={role}
              onStatusChange={fetchMeetings}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-gray-500 font-medium">
            {filter === "all" ? "No meetings yet" : `No ${filter} meetings`}
          </p>
          {role === "student" && filter === "all" && (
            <p className="text-gray-400 text-sm mt-1">
              Go to Faculty Directory to book your first meeting
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Meetings;
