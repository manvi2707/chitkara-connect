// =============================================
// LoginStudent.jsx — Student Login & Register
// =============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { studentLogin, studentRegister } from "../utils/api";

const LoginStudent = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const [formData, setFormData] = useState({
    name:       "",
    email:      "",
    password:   "",
    department: "CSE",
    year:       1,
    rollNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = isRegister
        ? await studentRegister(formData)
        : await studentLogin({ email: formData.email, password: formData.password });

      login(response.data.user, response.data.token);
      navigate("/student/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">🎓</div>
          <h2 className="text-2xl font-bold text-blue-800">
            {isRegister ? "Create Student Account" : "Student Login"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isRegister ? "Join ChitkaraConnect today" : "Welcome back! Please log in"}
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Register-only fields */}
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Roll Number
                </label>
                <input
                  type="text"
                  name="rollNumber"
                  placeholder="e.g. 2110991234"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  >
                    {["CSE", "ECE", "ME", "CE", "IT", "MBA"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year
                  </label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                  >
                    {[1, 2, 3, 4].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Common fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              University Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@chitkara.edu.in"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60 text-sm"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center text-sm text-gray-500 mt-5">
          {isRegister ? "Already have an account?" : "New student?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-blue-700 font-semibold hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>

        <div className="text-center mt-3 pt-3 border-t border-gray-100">
          <Link to="/login/faculty" className="text-xs text-gray-400 hover:text-gray-600">
            Are you faculty? → Faculty Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginStudent;