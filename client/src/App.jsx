// =============================================
// App.jsx — Main Router for the React App
// =============================================
// This file defines ALL the pages/routes in the app.
// React Router reads the URL and shows the correct page.

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Import all pages
import LoginStudent from "./pages/LoginStudent";
import LoginFaculty from "./pages/LoginFaculty";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

// ── Home / Landing Page ──────────────────────
const Home = () => {
  const { user } = useAuth();

  // If already logged in, skip home and go straight to dashboard
  if (user?.role === "student") return <Navigate to="/student/dashboard" />;
  if (user?.role === "faculty") return <Navigate to="/faculty/dashboard" />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 flex flex-col items-center justify-center text-white px-4">

      {/* Hero section */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">🎓</div>
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
          ChitkaraConnect
        </h1>
        <p className="text-xl text-blue-200 max-w-xl leading-relaxed">
          Your one-stop portal to connect with Chitkara University faculty —
          book meetings, send messages, and find the right help instantly.
        </p>
      </div>

      {/* Login buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <a
          href="/login/student"
          className="bg-white text-blue-900 font-bold px-10 py-3.5 rounded-xl text-lg hover:bg-blue-50 transition shadow-lg text-center"
        >
          I'm a Student →
        </a>
        <a
          href="/login/faculty"
          className="bg-green-500 hover:bg-green-600 text-white font-bold px-10 py-3.5 rounded-xl text-lg transition shadow-lg text-center"
        >
          I'm Faculty →
        </a>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-3xl w-full">
        {[
          {
            icon: "📋",
            title: "Faculty Directory",
            desc: "Browse all faculty with expertise, office address and availability",
          },
          {
            icon: "📅",
            title: "Book Meetings",
            desc: "Request a meeting time slot with any professor in one click",
          },
          {
            icon: "✉️",
            title: "Direct Messaging",
            desc: "Send messages to faculty and receive replies inside the portal",
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center border border-white/20 hover:bg-white/20 transition"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h3 className="font-bold text-lg mb-1">{feature.title}</h3>
            <p className="text-blue-200 text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-blue-300 text-sm mt-12">
        Chitkara University · Rajpura, Punjab
      </p>
    </div>
  );
};

// ── All App Routes ───────────────────────────
const AppRoutes = () => {
  return (
    <>
      {/* Navbar shows on every single page */}
      <Navbar />

      <Routes>
        {/* ── Public Routes (no login needed) ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login/student" element={<LoginStudent />} />
        <Route path="/login/faculty" element={<LoginFaculty />} />

        {/* ── Protected: Students only ── */}
        {/* ProtectedRoute checks: is user logged in + is role "student"? */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRole="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Protected: Faculty only ── */}
        <Route
          path="/faculty/dashboard"
          element={
            <ProtectedRoute allowedRole="faculty">
              <FacultyDashboard />
            </ProtectedRoute>
          }
        />

        {/* ── Catch-all: any unknown URL → home ── */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// ── Root App Component ───────────────────────
// AuthProvider wraps EVERYTHING so every page
// can access the logged-in user via useAuth()
const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
);

export default App;