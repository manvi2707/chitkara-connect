// =============================================
// Navbar.jsx — Top navigation bar
// Shows on every page of the app
// =============================================

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();           // clears user + token from context and localStorage
    navigate("/");      // redirect to home page
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      
      {/* Logo — clicking takes you home */}
      <Link to="/" className="text-xl font-bold tracking-wide hover:text-blue-200 transition">
        🎓 ChitkaraConnect
      </Link>

      {/* Right side — changes based on login status */}
      <div className="flex items-center gap-4">
        {user ? (
          // ── Logged in state ──
          <>
            <span className="text-sm text-blue-200 hidden sm:block">
              👋 {user.name} &nbsp;|&nbsp;
              <span className="capitalize">{user.role}</span>
            </span>

            {/* Go to their dashboard */}
            <Link
              to={user.role === "student" ? "/student/dashboard" : "/faculty/dashboard"}
              className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded transition"
            >
              Dashboard
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="text-sm bg-red-500 hover:bg-red-600 px-4 py-1.5 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          // ── Logged out state ──
          <>
            <Link
              to="/login/student"
              className="text-sm hover:text-blue-200 transition"
            >
              Student Login
            </Link>
            <Link
              to="/login/faculty"
              className="text-sm bg-white text-blue-800 hover:bg-blue-100 px-4 py-1.5 rounded font-semibold transition"
            >
              Faculty Login
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;