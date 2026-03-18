// =============================================
// components/Footer.jsx — Mobile Optimized
// =============================================

import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // Hide footer on dashboard pages
  const hiddenRoutes = ["/student/dashboard", "/faculty/dashboard"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060d1f] text-white">

      {/* ── Main footer content ── */}
      <div className="max-w-7xl mx-auto px-5 py-10">

        {/* ── Brand section — full width on mobile ── */}
        <div className="mb-8 pb-8 border-b border-white/10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 flex-shrink-0">
              <span className="text-white font-black text-base">C</span>
            </div>
            <span className="font-black text-xl tracking-tight">
              Chitkara<span className="text-blue-400">Connect</span>
            </span>
          </div>

          {/* Tagline */}
          <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
            Bridging the gap between students and faculty at Chitkara University.
            Find the right help, book meetings, and stay connected.
          </p>

          {/* University badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
            <span className="text-xs text-gray-300 font-medium">
              Chitkara University, Punjab
            </span>
          </div>
        </div>

        {/* ── Links grid — 2 columns on mobile, 2 on desktop ── */}
        <div className="grid grid-cols-2 gap-8 mb-8">

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-xs text-white uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home",          to: "/" },
                { label: "Student Login", to: "/login/student" },
                { label: "Faculty Login", to: "/login/faculty" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group"
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
            <h3 className="font-bold text-xs text-white uppercase tracking-widest mb-4">
              University
            </h3>
            <ul className="space-y-3">
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
                    className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 flex-shrink-0 group-hover:w-2 transition-all" />
                    <span className="truncate">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Tech stack badges — centered on mobile ── */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {["React", "Node.js", "MongoDB", "Express", "Tailwind"].map((tech) => (
            <span
              key={tech}
              className="text-xs bg-white/5 border border-white/10 text-gray-400 px-3 py-1.5 rounded-full"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-5 py-4">
          <p className="text-gray-500 text-xs text-center leading-relaxed">
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
