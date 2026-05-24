// =============================================
// App.jsx — Fixed mobile height + routes
// =============================================

import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import LoginStudent from "./pages/LoginStudent";
import LoginFaculty from "./pages/LoginFaculty";
import StudentDashboard from "./pages/StudentDashboard";
import FacultyDashboard from "./pages/FacultyDashboard";
import Messages from "./pages/Messages";
import NotFound from "./pages/NotFound";

// ── All App Routes ───────────────────────────
const AppRoutes = () => {
  const location = useLocation();
  const isDashboard = location.pathname.includes("/dashboard");
  const isMessages  = location.pathname === "/messages";

  return (
    // FIX: Use 100dvh (dynamic viewport height) for correct mobile height
    // 100vh on mobile includes the browser address bar, causing content to be cut off
    <div className="flex flex-col" style={{ minHeight: "100dvh" }}>
      <Navbar />

      <main
        className="flex-1 flex flex-col"
        style={{
          overflow: (isDashboard || isMessages) ? "hidden" : "auto",
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route path="/"              element={<Home />} />
          <Route path="/login/student" element={<LoginStudent />} />
          <Route path="/login/faculty" element={<LoginFaculty />} />

          {/* Protected: Students only */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Faculty only */}
          <Route
            path="/faculty/dashboard"
            element={
              <ProtectedRoute allowedRole="faculty">
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected: Messages (both roles) */}
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            }
          />

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isMessages && !isDashboard && <Footer />}
    </div>
  );
};

// ── Root App ─────────────────────────────────
const App = () => (
  <AuthProvider>
    <ToastProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ToastProvider>
  </AuthProvider>
);

export default App;
