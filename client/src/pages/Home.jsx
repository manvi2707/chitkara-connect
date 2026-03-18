// =============================================
// Home.jsx — New Beautiful Landing Page
// =============================================
// Replaces the old Home component inside App.jsx
// Cut this component OUT of App.jsx and put it here

import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  const [visible, setVisible] = useState(false);

  // Trigger entrance animation after mount
  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  // If already logged in redirect to dashboard
  if (user?.role === "student") return <Navigate to="/student/dashboard" />;
  if (user?.role === "faculty") return <Navigate to="/faculty/dashboard" />;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-hidden relative">

      {/* ── Animated background grid ── */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(99,179,237,0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(99,179,237,0.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }}
      />

      {/* ── Glowing orbs ── */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600 rounded-full blur-[120px] opacity-20 animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600 rounded-full blur-[140px] opacity-15 animate-pulse" style={{ animationDelay: "1s" }} />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 rounded-full blur-[100px] opacity-10 animate-pulse" style={{ animationDelay: "2s" }} />

      {/* ── Main content ── */}
      <div className={`relative z-10 flex flex-col items-center justify-center min-h-screen px-6 transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

        {/* Badge */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm text-blue-200 font-medium tracking-wide">
            Chitkara University Portal
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl sm:text-7xl font-black text-center mb-6 leading-tight tracking-tight"
          style={{ fontFamily: "'Georgia', serif" }}
        >
          <span className="text-white">Chitkara</span>
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-300 bg-clip-text text-transparent">
            Connect
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-blue-200/80 text-center max-w-xl mb-12 leading-relaxed">
          Bridge the gap between students and faculty.
          Book meetings, send messages, and find the
          right help — all in one place.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            to="/login/student"
            className="group relative px-10 py-4 bg-blue-600 hover:bg-blue-500 rounded-2xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105 text-center"
          >
            <span className="relative z-10">Student Portal →</span>
          </Link>
          <Link
            to="/login/faculty"
            className="group px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/40 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm hover:scale-105 text-center"
          >
            Faculty Portal →
          </Link>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl w-full">
          {[
            {
              icon: "👨‍🏫",
              title: "Faculty Directory",
              desc: "Browse all faculty with expertise, availability and office details",
              color: "from-blue-500/10 to-blue-600/5",
              border: "border-blue-500/20",
            },
            {
              icon: "📅",
              title: "Smart Meetings",
              desc: "Book time slots with professors and track request status in real time",
              color: "from-cyan-500/10 to-cyan-600/5",
              border: "border-cyan-500/20",
            },
            {
              icon: "✉️",
              title: "Direct Messaging",
              desc: "Send messages to faculty and receive replies directly in the portal",
              color: "from-indigo-500/10 to-indigo-600/5",
              border: "border-indigo-500/20",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`bg-gradient-to-br ${feature.color} border ${feature.border} rounded-2xl p-6 backdrop-blur-sm hover:scale-105 transition-all duration-300`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-3xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-blue-200/70 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <div className="flex gap-8 mt-16 border-t border-white/10 pt-8">
          {[
            { number: "500+", label: "Students" },
            { number: "50+",  label: "Faculty" },
            { number: "6",    label: "Departments" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-blue-400">{stat.number}</p>
              <p className="text-sm text-blue-200/60">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
