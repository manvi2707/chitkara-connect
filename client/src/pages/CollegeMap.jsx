// =============================================
// CollegeMap.jsx — Campus info & map
// =============================================

const DEPARTMENTS = [
  { name: "Computer Science & Engineering", hod: "Dr. CSE HOD", block: "Block A", phone: "Ext. 1001" },
  { name: "Electronics & Communication",    hod: "Dr. ECE HOD", block: "Block B", phone: "Ext. 1002" },
  { name: "Mechanical Engineering",         hod: "Dr. ME HOD",  block: "Block C", phone: "Ext. 1003" },
  { name: "Civil Engineering",              hod: "Dr. CE HOD",  block: "Block D", phone: "Ext. 1004" },
  { name: "Information Technology",         hod: "Dr. IT HOD",  block: "Block A", phone: "Ext. 1005" },
  { name: "MBA",                            hod: "Dr. MBA HOD", block: "Block E", phone: "Ext. 1006" },
];

const QUICK_CONTACTS = [
  { label: "Main Office",      number: "01795-661600", icon: "🏛️" },
  { label: "Student Helpdesk", number: "01795-661700", icon: "🎓" },
  { label: "Library",          number: "Ext. 2001",    icon: "📚" },
  { label: "Medical Center",   number: "Ext. 2002",    icon: "🏥" },
  { label: "Sports Complex",   number: "Ext. 2003",    icon: "⚽" },
  { label: "Hostel Office",    number: "Ext. 2004",    icon: "🏠" },
];

const CollegeMap = () => {
  return (
    <div className="p-6 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Campus Info</h1>
        <p className="text-gray-500 text-sm mt-1">
          Chitkara University — Rajpura, Punjab
        </p>
      </div>

      {/* Google Map embed */}
      <div className="rounded-xl overflow-hidden shadow border border-gray-200">
        <iframe
          title="Chitkara University Campus Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3434.123456789!2d76.6!3d30.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDMwJzAwLjAiTiA3NsKwMzYnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      {/* Address + directions */}
      <div className="bg-blue-50 rounded-xl p-5 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            📍 Campus Address
          </h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            Chitkara University<br />
            Chandigarh-Patiala National Highway,<br />
            Rajpura — 140401, Punjab, India
          </p>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            🚌 How to Reach
          </h3>
          <p className="text-sm text-blue-700 leading-relaxed">
            By Road: NH-7, 25km from Chandigarh<br />
            Nearest Railway: Rajpura Station (3km)<br />
            Nearest Airport: Chandigarh Airport (35km)
          </p>
        </div>
      </div>

      {/* Department list */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">🏫 Departments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DEPARTMENTS.map((dept) => (
            <div
              key={dept.name}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-800 text-sm mb-2">{dept.name}</h3>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">👨‍💼 HOD: {dept.hod}</p>
                <p className="text-xs text-gray-500">🏢 Location: {dept.block}</p>
                <p className="text-xs text-gray-500">📞 {dept.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick contacts */}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">📞 Quick Contacts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_CONTACTS.map((contact) => (
            <div
              key={contact.label}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center hover:shadow-md transition"
            >
              <div className="text-2xl mb-2">{contact.icon}</div>
              <p className="text-sm font-medium text-gray-700">{contact.label}</p>
              <p className="text-xs text-blue-600 mt-1">{contact.number}</p>
            </div>
          ))}
        </div>
      </div>

      {/* University links */}
      <div className="bg-gray-50 rounded-xl p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">🔗 Useful Links</h2>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "Official Website",  url: "https://www.chitkara.edu.in" },
            { label: "Student Portal",    url: "https://www.chitkara.edu.in/students" },
            { label: "Academic Calendar", url: "https://www.chitkara.edu.in/academics" },
            { label: "Exam Schedule",     url: "https://www.chitkara.edu.in/exams" },
            { label: "Library Portal",    url: "https://www.chitkara.edu.in/library" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-700 text-gray-600 px-4 py-2 rounded-lg transition"
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