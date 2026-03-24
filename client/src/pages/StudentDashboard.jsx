// =============================================
// pages/StudentDashboard.jsx
// =============================================

import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import FacultyDirectory from "./FacultyDirectory";
import Meetings from "./Meetings";
import Messages from "./Messages";
import CollegeMap from "./CollegeMap";

const StudentDashboard = () => {
  const [activeTab,      setActiveTab]      = useState("directory");
  const [msgUnreadCount, setMsgUnreadCount] = useState(0);

  const isMessages = activeTab === "messages";

  // Called by Messages component whenever unread count changes
  const handleUnreadChange = useCallback((count) => {
    setMsgUnreadCount(count);
  }, []);

  const TABS = [
    { id: "directory", label: "👨‍🏫 Faculty Directory", shortLabel: "Faculty" },
    { id: "meetings",  label: "📅 My Meetings",        shortLabel: "Meetings" },
    { id: "messages",  label: "✉️ Messages",            shortLabel: "Messages", badge: msgUnreadCount },
    { id: "map",       label: "🗺️ Campus Info",         shortLabel: "Campus" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "directory": return <FacultyDirectory />;
      case "meetings":  return <Meetings role="student" />;
      case "messages":  return <Messages onUnreadChange={handleUnreadChange} />;
      case "map":       return <CollegeMap />;
      default:          return <FacultyDirectory />;
    }
  };

  return (
    <div className="flex overflow-hidden bg-gray-50" style={{ height: "calc(100vh - 64px)" }}>
      <Sidebar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className={`flex-1 flex flex-col min-w-0 ${isMessages ? "overflow-hidden" : "overflow-y-auto"}`}>
        <div className="md:hidden h-14 flex-shrink-0" />
        <div className={isMessages ? "flex-1 overflow-hidden" : "flex-1"}>
          {renderContent()}
        </div>
        {!isMessages && <div className="md:hidden h-20 flex-shrink-0" />}
      </main>
    </div>
  );
};

export default StudentDashboard;