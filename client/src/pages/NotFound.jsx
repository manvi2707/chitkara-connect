// =============================================
// NotFound.jsx — 404 Error Page
// =============================================
// Shows when user visits a URL that doesn't exist

import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NotFound = () => {
  const { user } = useAuth();

  // Where to send the user back based on role
  const homeLink = user?.role === "student"
    ? "/student/dashboard"
    : user?.role === "faculty"
    ? "/faculty/dashboard"
    : "/";

  const homeLabel = user ? "Go to Dashboard" : "Go to Home";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">

        {/* Big 404 */}
        <div className="relative mb-8">
          <p className="text-[10rem] font-black text-gray-100 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🔍</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to={homeLink}
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition"
          >
            {homeLabel}
          </Link>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold transition"
          >
            ← Go Back
          </button>
        </div>

        {/* Helpful links */}
        <div className="mt-10 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-400 mb-3">Looking for one of these?</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/login/student"
              className="text-sm text-blue-600 hover:underline bg-blue-50 px-3 py-1.5 rounded-lg">
              Student Login
            </Link>
            <Link to="/login/faculty"
              className="text-sm text-green-600 hover:underline bg-green-50 px-3 py-1.5 rounded-lg">
              Faculty Login
            </Link>
            <Link to="/"
              className="text-sm text-gray-600 hover:underline bg-gray-100 px-3 py-1.5 rounded-lg">
              Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
