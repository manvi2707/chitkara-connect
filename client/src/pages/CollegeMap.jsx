// =============================================
// pages/CollegeMap.jsx — Chitkara University (Real Data)
// =============================================

const DEPARTMENTS = [
  {
    name: "Computer Science & Engineering",
    institute: "Chitkara University Institute of Engineering & Technology",
    icon: "💻",
    programs: "B.E. CSE · CSE (AI & ML) · CSE (AI & Future Tech)",
    email: "cse@chitkara.edu.in",
  },
  {
    name: "Electronics & Communication Engineering",
    institute: "Chitkara University Institute of Engineering & Technology",
    icon: "📡",
    programs: "B.E. ECE · Electronics & Computer Engg.",
    email: "ece@chitkara.edu.in",
  },
  {
    name: "Mechanical Engineering",
    institute: "Chitkara University Institute of Engineering & Technology",
    icon: "⚙️",
    programs: "B.E. ME · Mechatronics · Automobile Engg. (ARAI)",
    email: "me@chitkara.edu.in",
  },
  {
    name: "Civil Engineering",
    institute: "Chitkara University Institute of Engineering & Technology",
    icon: "🏗️",
    programs: "B.E. Civil · Civil with AI & ML Specialisation",
    email: "civil@chitkara.edu.in",
  },
  {
    name: "Chitkara Business School",
    institute: "CBS — Management & Commerce",
    icon: "📊",
    programs: "MBA · BBA · B.Com · IPM · BBA FinTech",
    email: "cbs@chitkara.edu.in",
  },
  {
    name: "Chitkara College of Pharmacy",
    institute: "Pharmaceutical Sciences",
    icon: "💊",
    programs: "B.Pharm · M.Pharm · Pharm.D",
    email: "pharmacy@chitkara.edu.in",
  },
  {
    name: "Chitkara Design School",
    institute: "Art & Design",
    icon: "🎨",
    programs: "B.Des Communication · Product Design · Fashion Design · BFA",
    email: "design@chitkara.edu.in",
  },
  {
    name: "Chitkara School of Health Sciences",
    institute: "Allied Healthcare & Nursing",
    icon: "🏥",
    programs: "B.Sc Nursing · Physiotherapy · Medical Radiology",
    email: "healthsciences@chitkara.edu.in",
  },
];

const QUICK_CONTACTS = [
  { label: "Admissions",      number: "+91-9501105718",        icon: "🎓" },
  { label: "Main Office",     number: "0176-2507084",          icon: "🏛️" },
  { label: "Exam Cell",       number: "examcell@chitkara.edu.in", icon: "📝" },
  { label: "Library",         number: "library@chitkara.edu.in",  icon: "📚" },
  { label: "Medical Center",  number: "0176-2507100",          icon: "🩺" },
  { label: "Hostel Office",   number: "hostel@chitkara.edu.in",   icon: "🏠" },
  { label: "Transport",       number: "transport@chitkara.edu.in",icon: "🚌" },
  { label: "Placement Cell",  number: "placements@chitkara.edu.in",icon: "💼" },
];

const RANKINGS = [
  { label: "NIRF 2025",        value: "#78",    sub: "Among Universities" },
  { label: "NIRF Pharmacy",    value: "#16",    sub: "Pharmacy Ranking" },
  { label: "NIRF Architecture",value: "#38",    sub: "Architecture Ranking" },
  { label: "QS Asia 2025",     value: "501–550",sub: "Asia Rankings" },
];

const CollegeMap = () => {
  return (
    <div className="p-4 sm:p-6 w-full overflow-x-hidden space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Campus Info</h1>
        <p className="text-gray-500 text-sm mt-1">
          Chitkara University — NH-64, Jansla Village, Rajpura, Punjab
        </p>
      </div>

      {/* Rankings strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {RANKINGS.map((r) => (
          <div key={r.label}
            className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-xl p-3 text-center shadow-sm">
            <p className="text-lg font-bold">{r.value}</p>
            <p className="text-xs font-medium opacity-90 leading-tight mt-0.5">{r.label}</p>
            <p className="text-xs opacity-70 leading-tight">{r.sub}</p>
          </div>
        ))}
      </div>

      {/* Google Map — correct coordinates */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <iframe
          title="Chitkara University Campus Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.8!2d76.6575891!3d30.5160865!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fc32344a6e2d7%3A0x81b346dee91799ca!2sChitkara%20University!5e0!3m2!1sen!2sin!4v1713200000000!5m2!1sen!2sin"
          width="100%"
          height="260"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Address + How to Reach */}
      <div className="bg-blue-50 rounded-xl p-4 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm">📍 Campus Address</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            Chitkara University<br />
            Chandigarh-Patiala National Highway (NH-64),<br />
            Village Jansla, Rajpura — 140401<br />
            Punjab, India
          </p>
          <p className="text-xs text-blue-500 mt-2">
            📧 admissions@chitkara.edu.in
          </p>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 mb-2 text-sm">🚌 How to Reach</h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            By Road: NH-64, ~33 km from Chandigarh<br />
            Railway: Rajpura Junction (~5 km)<br />
            Airport: Chandigarh Int'l (~35 km)<br />
            Bus: CU Express from Chandigarh ISBT
          </p>
        </div>
      </div>

      {/* About strip */}
      <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
        <h3 className="font-semibold text-amber-800 mb-1 text-sm">🏫 About the University</h3>
        <p className="text-sm text-amber-700 leading-relaxed">
          Established in 2010 under The Chitkara University Act 2008, the university
          spans a <strong>70-acre campus</strong> and offers programmes in Engineering,
          Management, Pharmacy, Design, Law, Health Sciences, Architecture, Hospitality,
          and more. Accredited by <strong>NAAC</strong> and recognised by <strong>UGC</strong>.
        </p>
      </div>

      {/* Departments */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">🏫 Schools & Departments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEPARTMENTS.map((dept) => (
            <div key={dept.name}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-2 mb-2">
                <span className="text-lg">{dept.icon}</span>
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm leading-tight">{dept.name}</h3>
                  <p className="text-xs text-gray-400 leading-tight mt-0.5">{dept.institute}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 mb-1">📋 {dept.programs}</p>
              <p className="text-xs text-blue-500">✉️ {dept.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Contacts */}
      <div>
        <h2 className="text-base font-bold text-gray-800 mb-3">📞 Quick Contacts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {QUICK_CONTACTS.map((contact) => (
            <div key={contact.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 text-center">
              <div className="text-xl mb-1">{contact.icon}</div>
              <p className="text-xs font-medium text-gray-700">{contact.label}</p>
              <p className="text-xs text-blue-600 mt-0.5 break-all">{contact.number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Student Clubs */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-800 mb-3">🤝 Active Student Chapters</h2>
        <div className="flex flex-wrap gap-2">
          {["IEEE", "ACM", "AIESEC", "IETE", "SAE India", "CSI", "IEI"].map((club) => (
            <span key={club}
              className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded-full font-medium">
              {club}
            </span>
          ))}
        </div>
      </div>

      {/* Useful Links */}
      <div className="bg-gray-50 rounded-xl p-4">
        <h2 className="text-base font-bold text-gray-800 mb-3">🔗 Useful Links</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Official Website",   url: "https://www.chitkara.edu.in" },
            { label: "Student Portal",     url: "https://www.chitkara.edu.in/students" },
            { label: "Academic Calendar",  url: "https://www.chitkara.edu.in/academics" },
            { label: "Exam Schedule",      url: "https://www.chitkara.edu.in/exam-schedule" },
            { label: "Library Portal",     url: "https://www.chitkara.edu.in/library" },
            { label: "Placement Cell",     url: "https://www.chitkara.edu.in/placements" },
            { label: "Grievance Portal",   url: "https://www.chitkara.edu.in/grievance-redressal" },
            { label: "Admission Helpline", url: "https://www.chitkara.edu.in/admissions/admission-helpline" },
          ].map((link) => (
            <a key={link.label} href={link.url} target="_blank" rel="noreferrer"
              className="text-xs bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-600 px-3 py-2 rounded-lg transition"
            >
              {link.label} ↗
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default CollegeMap;