// =============================================
// FacultyDashboard.jsx — Faculty main layout
// =============================================

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FacultyProfileEdit from "./FacultyProfileEdit";
import Meetings from "./Meetings";
import Messages from "./Messages";

// Tab definitions for faculty sidebar
const TABS = [
  { id: "profile",   label: "👤 My Profile" },
  { id: "meetings",  label: "📅 Meeting Requests" },
  { id: "messages",  label: "✉️ Messages" },
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
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default FacultyDashboard;
