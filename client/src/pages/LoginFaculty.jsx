// =============================================
// LoginFaculty.jsx — Faculty Login & Register
// =============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { facultyLogin, facultyRegister } from "../utils/api";

const LoginFaculty = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");

  const [formData, setFormData] = useState({
    name:        "",
    email:       "",
    password:    "",
    department:  "CSE",
    designation: "Assistant Professor",
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
        ? await facultyRegister(formData)
        : await facultyLogin({ email: formData.email, password: formData.password });

      login(response.data.user, response.data.token);
      navigate("/faculty/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        <div className="text-center mb-6">
          <div className="text-4xl mb-2">👨‍🏫</div>
          <h2 className="text-2xl font-bold text-green-800">
            {isRegister ? "Faculty Registration" : "Faculty Login"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {isRegister ? "Register as Chitkara Faculty" : "Access your faculty portal"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text" name="name" placeholder="e.g. Dr. Priya Sharma"
                  value={formData.name} onChange={handleChange} required
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <select
                    name="department" value={formData.department} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                  >
                    {["CSE", "ECE", "ME", "CE", "IT", "MBA"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
                  <select
                    name="designation" value={formData.designation} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                  >
                    {["Assistant Professor", "Associate Professor", "Professor", "HOD"].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">University Email</label>
            <input
              type="email" name="email" placeholder="you@chitkara.edu.in"
              value={formData.email} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password" name="password" placeholder="Minimum 6 characters"
              value={formData.password} onChange={handleChange} required
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-lg font-semibold transition disabled:opacity-60 text-sm"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {isRegister ? "Already registered?" : "New faculty member?"}{" "}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(""); }}
            className="text-green-700 font-semibold hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>

        <div className="text-center mt-3 pt-3 border-t border-gray-100">
          <Link to="/login/student" className="text-xs text-gray-400 hover:text-gray-600">
            Are you a student? → Student Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginFaculty;