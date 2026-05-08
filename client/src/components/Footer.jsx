// =============================================
// components/Footer.jsx — Compact
// =============================================

import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  const hiddenRoutes = ["/student/dashboard", "/faculty/dashboard"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060d1f] text-white">

      {/* ── Main footer content ── */}
      <div className="max-w-7xl mx-auto px-5 py-6">

        {/* ── Brand section ── */}
        <div className="mb-5 pb-5 border-b border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <span className="text-white font-black text-sm">C</span>
            </div>
            <span className="font-black text-lg tracking-tight">
              Chitkara<span className="text-blue-400">Connect</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-xs leading-relaxed mb-3 max-w-sm">
            Bridging the gap between students and faculty at Chitkara University.
            Find the right help, book meetings, and stay connected.
          </p>

          {/* University badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="text-xs text-gray-300 font-medium">
              Chitkara University, Punjab
            </span>
          </div>
        </div>

        {/* ── Links grid ── */}
        <div className="grid grid-cols-2 gap-6 mb-5">

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-widest mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home",          to: "/" },
                { label: "Student Login", to: "/login/student" },
                { label: "Faculty Login", to: "/login/faculty" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-xs transition flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0 group-hover:w-2 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* University Links */}
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-widest mb-3">
              University
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Official Website",  href: "https://www.chitkara.edu.in" },
                { label: "Student Portal",    href: "https://www.chitkara.edu.in/students" },
                { label: "Academic Calendar", href: "https://www.chitkara.edu.in/academics" },
                { label: "Library",           href: "https://www.chitkara.edu.in/library" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-white text-xs transition flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0 group-hover:w-2 transition-all" />
                    <span className="truncate">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-3">
          <p className="text-gray-500 text-xs text-center">
            © {currentYear} ChitkaraConnect
            <span className="mx-1.5 text-gray-700">·</span>
            Final Year Project
            <span className="mx-1.5 text-gray-700">·</span>
            B.E. CSE
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;