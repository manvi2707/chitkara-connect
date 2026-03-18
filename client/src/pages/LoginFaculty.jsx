// =============================================
// LoginFaculty.jsx — Beautiful Faculty Login
// =============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { facultyLogin, facultyRegister } from "../utils/api";

const LoginFaculty = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    department: "CSE", designation: "Assistant Professor",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isRegister
        ? await facultyRegister(formData)
        : await facultyLogin({ email: formData.email, password: formData.password });

      login(response.data.user, response.data.token);
      toast.success(
        isRegister ? "Account created!" : "Welcome back!",
        `Hello, ${response.data.user.name}!`
      );
      navigate("/faculty/dashboard");
    } catch (err) {
      toast.error(
        "Login failed",
        err.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-emerald-900 to-emerald-800 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-emerald-700 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-green-700 rounded-full blur-3xl opacity-40" />

        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 backdrop-blur-sm border border-white/20">
            👨‍🏫
          </div>
          <h2 className="text-3xl font-black mb-4 leading-tight">
            Manage Your<br />Student Interactions
          </h2>
          <p className="text-emerald-200 leading-relaxed max-w-sm">
            Update your profile, manage meeting requests, and reply to student messages all from your faculty dashboard.
          </p>

          <div className="mt-8 space-y-3 text-left">
            {[
              "Update your expertise & availability",
              "Accept or reject meeting requests",
              "Reply to student messages",
              "Manage your office hours",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-xs">✓</span>
                <span className="text-emerald-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          <div className="mb-8">
            <Link to="/" className="text-sm text-emerald-600 hover:underline flex items-center gap-1 mb-6">
              ← Back to home
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              {isRegister ? "Faculty Registration" : "Faculty Portal"}
            </h1>
            <p className="text-gray-500">
              {isRegister
                ? "Register as Chitkara University faculty"
                : "Sign in to your faculty dashboard"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} required
                    placeholder="e.g. Dr. Priya Sharma"
                    className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Department</label>
                    <select name="department" value={formData.department}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                    >
                      {["CSE","ECE","ME","CE","IT","MBA"].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Designation</label>
                    <select name="designation" value={formData.designation}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                    >
                      {["Assistant Professor","Associate Professor","Professor","HOD"].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">University Email</label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required
                placeholder="you@chitkara.edu.in"
                className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={formData.password}
                  onChange={handleChange} required
                  placeholder="Minimum 6 characters"
                  className="w-full border-2 border-gray-200 focus:border-emerald-500 rounded-xl px-4 py-3 text-sm outline-none transition pr-12"
                />
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-emerald-500/25"
            >
              {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {isRegister ? "Already registered?" : "New faculty member?"}{" "}
            <button onClick={() => setIsRegister(!isRegister)}
              className="text-emerald-600 font-bold hover:underline">
              {isRegister ? "Sign in" : "Register here"}
            </button>
          </p>

          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <Link to="/login/student" className="text-xs text-gray-400 hover:text-gray-600">
              Are you a student? → Student Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginFaculty;
