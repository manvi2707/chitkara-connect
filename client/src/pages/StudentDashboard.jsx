// =============================================
// pages/StudentDashboard.jsx — Mobile-fixed
// =============================================

import { useState, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import FacultyDirectory from "./FacultyDirectory";
import Meetings from "./Meetings";
import Messages from "./Messages";
import CollegeMap from "./CollegeMap";
import StudentSettings from "./StudentSettings";
import ChatbotWidget from "../components/ChatbotWidget";

const StudentDashboard = () => {
  const [activeTab,            setActiveTab]            = useState("directory");
  const [msgUnreadCount,       setMsgUnreadCount]       = useState(0);
  const [selectedConversationId, setSelectedConversationId] = useState(null);

  const isMessages = activeTab === "messages";

  const handleOpenMessages = (conversationId) => {
    setSelectedConversationId(conversationId);
    setActiveTab("messages");
  };

  const handleUnreadChange = useCallback((count) => {
    setMsgUnreadCount(count);
  }, []);

  const TABS = [
    { id: "directory", label: "👨‍🏫 Faculty Directory", shortLabel: "Faculty" },
    { id: "meetings",  label: "📅 My Meetings",        shortLabel: "Meetings" },
    { id: "messages",  label: "✉️ Messages",            shortLabel: "Messages", badge: msgUnreadCount },
    { id: "map",       label: "🗺️ Campus Info",         shortLabel: "Campus" },
    { id: "settings",  label: "⚙️ Settings",            shortLabel: "Settings" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "directory": return <FacultyDirectory onOpenMessages={handleOpenMessages} />;
      case "meetings":  return <Meetings role="student" />;
      case "messages":  return <Messages onUnreadChange={handleUnreadChange} initialConversationId={selectedConversationId} />;
      case "map":       return <CollegeMap />;
      case "settings":  return <StudentSettings />;
      default:          return <FacultyDirectory />;
    }
  };

  return (
    // FIX: Use calc with dvh for correct mobile height (navbar is 64px)
    <div
      className="flex overflow-hidden bg-gray-50"
      style={{ height: "calc(100dvh - 64px)" }}
    >
      <Sidebar tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className={`flex-1 flex flex-col min-w-0 ${isMessages ? "overflow-hidden" : "overflow-y-auto"}`}>
        {/* Spacer for mobile bottom nav */}
        <div className="md:hidden h-14 flex-shrink-0" />

        <div className={`${isMessages ? "flex-1 overflow-hidden flex flex-col" : "flex-1"}`}>
          {renderContent()}
        </div>

        {/* Bottom padding so content isn't hidden behind mobile nav */}
        {!isMessages && <div className="md:hidden h-20 flex-shrink-0" />}
      </main>

      {/* AI Chatbot — only on student portal */}
      <ChatbotWidget />
    </div>
  );
};

export default StudentDashboard;
