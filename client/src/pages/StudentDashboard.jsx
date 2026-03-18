// =============================================
// pages/StudentDashboard.jsx — Mobile Responsive
// =============================================

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FacultyDirectory from "./FacultyDirectory";
import Meetings from "./Meetings";
import Messages from "./Messages";
import CollegeMap from "./CollegeMap";

// shortLabel is used in mobile bottom tab bar
const TABS = [
  { id: "directory", label: "👨‍🏫 Faculty Directory", shortLabel: "Faculty" },
  { id: "meetings",  label: "📅 My Meetings",        shortLabel: "Meetings" },
  { id: "messages",  label: "✉️ Messages",            shortLabel: "Messages" },
  { id: "map",       label: "🗺️ Campus Info",         shortLabel: "Campus" },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("directory");

  const renderContent = () => {
    switch (activeTab) {
      case "directory": return <FacultyDirectory />;
      case "meetings":  return <Meetings role="student" />;
      case "messages":  return <Messages />;
      case "map":       return <CollegeMap />;
      default:          return <FacultyDirectory />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar — desktop only (mobile uses bottom tabs) */}
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      {/* pt-24 on mobile = space for top bar (navbar + mobile top bar) */}
      {/* pb-20 on mobile = space for bottom tab bar */}
      <main className="flex-1 overflow-y-auto pt-0 md:pt-0 mt-0">
        <div className="md:hidden h-14" /> {/* spacer for mobile top bar */}
        {renderContent()}
        <div className="md:hidden h-20" /> {/* spacer for mobile bottom bar */}
      </main>
    </div>
  );
};

export default StudentDashboard;
