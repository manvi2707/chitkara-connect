// =============================================
// Sidebar.jsx — New Beautiful Sidebar
// =============================================
// Replaces old Sidebar.jsx completely
// Has better styling, avatar, active states

import { useAuth } from "../context/AuthContext";

const Sidebar = ({ tabs, activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const isStudent = user?.role === "student";

  return (
    <aside className={`w-64 min-h-screen flex flex-col ${
      isStudent
        ? "bg-gradient-to-b from-blue-900 to-blue-950"
        : "bg-gradient-to-b from-emerald-900 to-emerald-950"
    } text-white`}>

      {/* ── User profile section ── */}
      <div className="p-5 border-b border-white/10">
        {/* Avatar */}
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shadow-lg ${
            isStudent ? "bg-blue-500" : "bg-emerald-500"
          }`}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-white/50 truncate">{user?.email}</p>
          </div>
        </div>

        {/* Role + department badges */}
        <div className="flex gap-2 mt-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${
            isStudent
              ? "bg-blue-500/30 text-blue-200"
              : "bg-emerald-500/30 text-emerald-200"
          }`}>
            {user?.role}
          </span>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-white/10 text-white/70">
            {user?.department}
          </span>
        </div>
      </div>

      {/* ── Navigation tabs ── */}
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
            {/* Icon — first character of label */}
            <span className="text-base">{tab.label.split(" ")[0]}</span>
            {/* Label — rest of the text */}
            <span>{tab.label.split(" ").slice(1).join(" ")}</span>

            {/* Active indicator dot */}
            {activeTab === tab.id && (
              <span className={`ml-auto w-1.5 h-1.5 rounded-full ${
                isStudent ? "bg-blue-500" : "bg-emerald-500"
              }`} />
            )}
          </button>
        ))}
      </nav>

      {/* ── Footer ── */}
      <div className="p-4 border-t border-white/10">
        <p className="text-xs text-white/30 text-center">
          ChitkaraConnect v2.0
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
