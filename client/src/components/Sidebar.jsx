// =============================================
// components/Sidebar.jsx — Mobile Responsive
// =============================================
// Desktop: sidebar on the left (unchanged)
// Mobile:  bottom tab bar (like a phone app)

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";
import PhotoUpload from "./PhotoUpload";

const Sidebar = ({ tabs, activeTab, setActiveTab }) => {
  const { user, profilePhoto } = useAuth();
  const isStudent = user?.role === "student";
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const activeColor = isStudent ? "bg-blue-600" : "bg-emerald-600";
  const activeBorder = isStudent ? "border-blue-600" : "border-emerald-600";
  const activeText = isStudent ? "text-blue-600" : "text-emerald-600";

  return (
    <>
      {/* ══════════════════════════════════════
          DESKTOP SIDEBAR — hidden on mobile
          ══════════════════════════════════════ */}
      <aside className={`hidden md:flex w-64 min-h-screen flex-col ${
        isStudent
          ? "bg-gradient-to-b from-blue-900 to-blue-950"
          : "bg-gradient-to-b from-emerald-900 to-emerald-950"
      } text-white flex-shrink-0`}>

        {/* User profile section */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <button
              onClick={() => setShowPhotoUpload(true)}
              className="relative group flex-shrink-0"
              title="Click to update photo"
            >
              <UserAvatar
                name={user?.name}
                photo={profilePhoto}
                role={user?.role}
                size="lg"
                shape="rounded"
                className="border-2 border-white/20 group-hover:border-white/60 transition"
              />
              <div className="absolute inset-0 rounded-xl bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <span className="text-base">📷</span>
              </div>
            </button>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm truncate">{user?.name}</p>
              <p className="text-xs text-white/50 truncate">{user?.email}</p>
            </div>
          </div>

          <p className="text-xs text-white/30 text-center mb-3">
            👆 Click photo to update
          </p>

          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
              isStudent ? "bg-blue-500/30 text-blue-200" : "bg-emerald-500/30 text-emerald-200"
            }`}>
              {user?.role}
            </span>
            <span className="text-xs px-2 py-1 rounded-full font-medium bg-white/10 text-white/70">
              {user?.department}
            </span>
          </div>
        </div>

        {/* Desktop tab navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3 ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-lg shadow-black/20"
                  : "text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              <span className="text-base">{tab.label.split(" ")[0]}</span>
              <span>{tab.label.split(" ").slice(1).join(" ")}</span>
              {activeTab === tab.id && (
                <span className={`ml-auto w-1.5 h-1.5 rounded-full ${
                  isStudent ? "bg-blue-500" : "bg-emerald-500"
                }`} />
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-xs text-white/30 text-center">ChitkaraConnect v2.0</p>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MOBILE TOP BAR — shown only on mobile
          ══════════════════════════════════════ */}
      <div className={`md:hidden fixed top-16 left-0 right-0 z-30 ${
        isStudent ? "bg-blue-900" : "bg-emerald-900"
      } px-4 py-3 flex items-center justify-between border-b border-white/10`}>

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <button onClick={() => setShowPhotoUpload(true)}>
            <UserAvatar
              name={user?.name}
              photo={profilePhoto}
              role={user?.role}
              size="sm"
              shape="rounded"
              className="border border-white/30"
            />
          </button>
          <div>
            <p className="text-white font-bold text-xs truncate max-w-28">{user?.name}</p>
            <p className="text-white/50 text-xs capitalize">{user?.role}</p>
          </div>
        </div>

        {/* Current tab name */}
        <p className="text-white font-semibold text-sm">
          {tabs.find(t => t.id === activeTab)?.label || ""}
        </p>
      </div>

      {/* ══════════════════════════════════════
          MOBILE BOTTOM TAB BAR
          ══════════════════════════════════════ */}
      <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex`}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition ${
              activeTab === tab.id
                ? activeText
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {/* Tab icon */}
            <span className="text-lg leading-none">
              {tab.label.split(" ")[0]}
            </span>
            {/* Tab label — shortened */}
            <span className="text-xs font-medium leading-none truncate max-w-16">
              {tab.shortLabel || tab.label.split(" ").slice(1).join(" ")}
            </span>
            {/* Active indicator dot */}
            {activeTab === tab.id && (
              <span className={`w-1 h-1 rounded-full ${activeColor}`} />
            )}
          </button>
        ))}
      </nav>

      {/* Photo upload popup */}
      {showPhotoUpload && (
        <PhotoUpload onClose={() => setShowPhotoUpload(false)} />
      )}
    </>
  );
};

export default Sidebar;
