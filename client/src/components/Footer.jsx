// =============================================
// Footer.jsx — Beautiful Site Footer
// =============================================
// Add this to App.jsx below the Routes

import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const location = useLocation();

  // Don't show footer on dashboard pages (they have sidebar)
  const hiddenRoutes = ["/student/dashboard", "/faculty/dashboard"];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#060d1f] text-white">

      {/* ── Main footer content ── */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Column 1: Brand ── */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="text-white font-black text-base">C</span>
              </div>
              <span className="font-black text-xl tracking-tight">
                Chitkara<span className="text-blue-400">Connect</span>
              </span>
            </div>

            {/* Tagline */}
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs mb-5">
              Bridging the gap between students and faculty at Chitkara University.
              Find the right help, book meetings, and stay connected.
            </p>

            {/* University badge */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-300 font-medium">
                Chitkara University, Punjab
              </span>
            </div>
          </div>

          {/* ── Column 2: Quick Links ── */}
          <div>
            <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Home",           to: "/" },
                { label: "Student Login",  to: "/login/student" },
                { label: "Faculty Login",  to: "/login/faculty" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-white text-sm transition flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500 group-hover:w-2 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Column 3: University Links ── */}
          <div>
            <h3 className="font-bold text-sm text-white mb-4 uppercase tracking-wider">
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
                    <span className="w-1 h-1 rounded-full bg-blue-500 group-hover:w-2 transition-all" />
                    {link.label}
                    <span className="text-gray-600 group-hover:text-gray-400 transition text-xs">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-white/10" />

      {/* ── Bottom bar ── */}
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">

          {/* Copyright */}
          <p className="text-gray-500 text-xs text-center sm:text-left">
            © {currentYear} ChitkaraConnect · Built as a Final Year Project ·
            B.E. Computer Science & Engineering
          </p>

          {/* Tech stack badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {["React", "Node.js", "MongoDB", "Express"].map((tech) => (
              <span
                key={tech}
                className="text-xs bg-white/5 border border-white/10 text-gray-400 px-2.5 py-1 rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
