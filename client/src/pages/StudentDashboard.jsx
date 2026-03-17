// =============================================
// StudentDashboard.jsx — Student main layout
// =============================================

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import FacultyDirectory from "./FacultyDirectory";
import Meetings from "./Meetings";
import Messages from "./Messages";
import CollegeMap from "./CollegeMap";

// Tab definitions for student sidebar
const TABS = [
  { id: "directory", label: "👨‍🏫 Faculty Directory" },
  { id: "meetings",  label: "📅 My Meetings" },
  { id: "messages",  label: "✉️ Messages" },
  { id: "map",       label: "🗺️ Campus Info" },
];

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState("directory");

  // Render the correct page based on active tab
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
      {/* Left sidebar */}
      <Sidebar
        tabs={TABS}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main content — changes based on active tab */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default StudentDashboard;