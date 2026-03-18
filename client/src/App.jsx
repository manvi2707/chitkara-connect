// =============================================
// App.jsx — Updated with Footer
// =============================================

import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

// ── All App Routes ───────────────────────────
const AppRoutes = () => {
  return (
    // min-h-screen + flex column makes footer stick to bottom
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Main content grows to fill space */}
      <main className="flex-1">
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

          {/* 404 page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer — hides itself on dashboard pages */}
      <Footer />
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
