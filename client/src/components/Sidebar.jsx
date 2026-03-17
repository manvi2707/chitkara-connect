// =============================================
// Sidebar.jsx — Reusable sidebar navigation
// Used by both StudentDashboard and FacultyDashboard
// =============================================

import { useAuth } from "../context/AuthContext";

const Sidebar = ({ tabs, activeTab, setActiveTab }) => {
  const { user } = useAuth();

  // Color theme changes based on role
  const isStudent = user?.role === "student";
  const bgColor   = isStudent ? "bg-blue-900"  : "bg-green-900";
  const textMuted = isStudent ? "text-blue-300" : "text-green-300";
  const activeStyle = isStudent
    ? "bg-white text-blue-900"
    : "bg-white text-green-900";
  const hoverStyle = isStudent
    ? "hover:bg-blue-800 text-blue-100"
    : "hover:bg-green-800 text-green-100";

  return (
    <aside className={`w-60 min-h-screen ${bgColor} text-white flex flex-col p-4`}>
      
      {/* User info at top of sidebar */}
      <div className="mb-8">
        {/* Avatar circle with first letter of name */}
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-xl font-bold mb-3">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <p className={`${textMuted} text-xs mb-0.5`}>Logged in as</p>
        <p className="font-semibold text-sm truncate">{user?.name}</p>
        <p className={`${textMuted} text-xs capitalize`}>
          {user?.department} · {user?.role}
        </p>
      </div>

      {/* Tab navigation buttons */}
      <nav className="space-y-1 flex-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id ? activeStyle : hoverStyle
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Footer at bottom of sidebar */}
      <div className={`${textMuted} text-xs mt-8 text-center`}>
        ChitkaraConnect v1.0
      </div>
    </aside>
  );
};

export default Sidebar;