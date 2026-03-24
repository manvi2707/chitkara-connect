// =============================================
// pages/FacultyDashboard.jsx
// =============================================

import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import FacultyProfileEdit from "./FacultyProfileEdit";
import Meetings from "./Meetings";
import Messages from "./Messages";

const FacultyDashboard = () => {
  const [activeTab,      setActiveTab]      = useState("profile");
  const [msgUnreadCount, setMsgUnreadCount] = useState(0);

  const isMessages = activeTab === "messages";

  const handleUnreadChange = useCallback((count) => {
    setMsgUnreadCount(count);
  }, []);

  const TABS = [
    { id: "profile",  label: "👤 My Profile",         shortLabel: "Profile" },
    { id: "meetings", label: "📅 Meeting Requests",    shortLabel: "Meetings" },
    { id: "messages", label: "✉️ Messages",             shortLabel: "Messages", badge: msgUnreadCount },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "profile":  return <FacultyProfileEdit />;
      case "meetings": return <Meetings role="faculty" />;
      case "messages": return <Messages onUnreadChange={handleUnreadChange} />;
      default:         return <FacultyProfileEdit />;
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

export default FacultyDashboard;