// =============================================
// pages/FacultyDashboard.jsx — Mobile Responsive
// =============================================

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FacultyProfileEdit from "./FacultyProfileEdit";
import Meetings from "./Meetings";
import Messages from "./Messages";

const TABS = [
  { id: "profile",  label: "👤 My Profile",         shortLabel: "Profile" },
  { id: "meetings", label: "📅 Meeting Requests",    shortLabel: "Meetings" },
  { id: "messages", label: "✉️ Messages",             shortLabel: "Messages" },
];

const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const renderContent = () => {
    switch (activeTab) {
      case "profile":  return <FacultyProfileEdit />;
      case "meetings": return <Meetings role="faculty" />;
      case "messages": return <Messages />;
      default:         return <FacultyProfileEdit />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Sidebar — desktop only */}
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden h-14" /> {/* spacer for mobile top bar */}
        {renderContent()}
        <div className="md:hidden h-20" /> {/* spacer for mobile bottom tabs */}
      </main>
    </div>
  );
};

export default FacultyDashboard;
