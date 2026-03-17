// =============================================
// FacultyCard.jsx — Single faculty info card
// Used in FacultyDirectory page
// Shows faculty details + Book Meeting button
// =============================================

import { useState } from "react";
import BookMeetingModal from "./BookMeetingModal";

const FacultyCard = ({ faculty }) => {
  // Controls whether the Book Meeting popup is open
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
        
        {/* Top section — avatar + name + department */}
        <div className="flex items-center gap-4 mb-4">
          {faculty.profilePhoto ? (
            <img
              src={faculty.profilePhoto}
              alt={faculty.name}
              className="w-14 h-14 rounded-full object-cover"
            />
          ) : (
            // Default avatar if no photo uploaded
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-700">
              {faculty.name.charAt(0)}
            </div>
          )}

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
              <span
                key={skill}
                className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full"
              >
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

        {/* Availability badge + Book button */}
        <div className="flex items-center justify-between">
          <span
            className={`text-xs px-2 py-1 rounded-full font-medium ${
              faculty.isAvailable
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }`}
          >
            {faculty.isAvailable ? "✅ Available" : "❌ Unavailable"}
          </span>

          {/* Only show button if faculty is available */}
          {faculty.isAvailable && (
            <button
              onClick={() => setShowModal(true)}
              className="text-sm bg-blue-700 hover:bg-blue-800 text-white px-3 py-1.5 rounded-lg transition"
            >
              Book Meeting
            </button>
          )}
        </div>
      </div>

      {/* Book Meeting Popup */}
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