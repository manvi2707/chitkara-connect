// =============================================
// components/Navbar.jsx — With Global Photo
// =============================================

import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "./Toast";
import UserAvatar from "./UserAvatar";

const Navbar = () => {
  const { user, profilePhoto, logout } = useAuth(); // ← profilePhoto from context
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success("Logged out", "See you next time!");
    navigate("/");
    setMenuOpen(false);
  };

  const isHome = location.pathname === "/";

  return (
    <nav className={`sticky top-0 z-40 transition-all duration-300 ${
      isHome
        ? "bg-[#060d1f]/90 backdrop-blur-md border-b border-white/10"
        : "bg-white border-b border-gray-200 shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <span className="text-white font-black text-base">C</span>
            </div>
            <span className={`font-black text-lg tracking-tight transition ${
              isHome ? "text-white" : "text-gray-900"
            }`}>
              Chitkara
              <span className={isHome ? "text-blue-400" : "text-blue-600"}>
                Connect
              </span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <>
                {/* User pill with REAL photo */}
                <div className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-sm ${
                  isHome
                    ? "bg-white/10 text-white border border-white/20"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}>
                  {/* UserAvatar uses global profilePhoto */}
                  <UserAvatar
                    name={user.name}
                    photo={profilePhoto}
                    role={user.role}
                    size="sm"
                    shape="rounded"
                  />
                  <span className="font-semibold max-w-28 truncate">
                    {user.name}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                    user.role === "student"
                      ? isHome ? "bg-blue-500/30 text-blue-200" : "bg-blue-100 text-blue-700"
                      : isHome ? "bg-emerald-500/30 text-emerald-200" : "bg-emerald-100 text-emerald-700"
                  }`}>
                    {user.role}
                  </span>
                </div>

                {/* Dashboard link */}
                <Link
                  to={user.role === "student" ? "/student/dashboard" : "/faculty/dashboard"}
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
                    isHome
                      ? "text-white/80 hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                </Link>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="text-sm font-semibold px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login/student"
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition ${
                    isHome
                      ? "text-white/80 hover:text-white hover:bg-white/10 border border-white/20"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  Student Login
                </Link>
                <Link
                  to="/login/faculty"
                  className="text-sm font-semibold px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-md shadow-blue-500/25"
                >
                  Faculty Login
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`sm:hidden p-2.5 rounded-xl transition ${
              isHome
                ? "text-white hover:bg-white/10 border border-white/20"
                : "text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-2">
            {user ? (
              <>
                <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                  {/* Real photo in mobile menu too */}
                  <UserAvatar
                    name={user.name}
                    photo={profilePhoto}
                    role={user.role}
                    size="md"
                    shape="rounded"
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user.role} · {user.department}
                    </p>
                  </div>
                </div>

                <Link
                  to={user.role === "student" ? "/student/dashboard" : "/faculty/dashboard"}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl transition"
                >
                  <span>📊</span> Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition"
                >
                  <span>🚪</span> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login/student" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-200"
                >
                  <span>🎓</span> Student Login
                </Link>
                <Link to="/login/faculty" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  <span>👨‍🏫</span> Faculty Login
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
