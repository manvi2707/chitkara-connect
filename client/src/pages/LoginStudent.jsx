// =============================================
// LoginStudent.jsx — Beautiful Login Page
// =============================================

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/Toast";
import { studentLogin, studentRegister } from "../utils/api";

const LoginStudent = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "", email: "", password: "",
    department: "CSE", year: 1, rollNumber: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = isRegister
        ? await studentRegister(formData)
        : await studentLogin({ email: formData.email, password: formData.password });

      login(response.data.user, response.data.token);
      toast.success(
        isRegister ? "Account created!" : "Welcome back!",
        `Hello, ${response.data.user.name}!`
      );
      navigate("/student/dashboard");
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">

      {/* ── Left panel — decorative ── */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 to-blue-800 items-center justify-center p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-700 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-indigo-700 rounded-full blur-3xl opacity-40" />

        <div className="relative z-10 text-white text-center">
          <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 backdrop-blur-sm border border-white/20">
            🎓
          </div>
          <h2 className="text-3xl font-black mb-4 leading-tight">
            Connect with your<br />Faculty Easily
          </h2>
          <p className="text-blue-200 leading-relaxed max-w-sm">
            Book meetings, send messages, and find the right faculty member for your needs — all in one place.
          </p>

          {/* Features list */}
          <div className="mt-8 space-y-3 text-left">
            {[
              "Browse faculty by expertise",
              "Book meeting time slots",
              "Send direct messages",
              "Track your requests",
            ].map((f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-xs">✓</span>
                <span className="text-blue-100 text-sm">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <Link to="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1 mb-6">
              ← Back to home
            </Link>
            <h1 className="text-3xl font-black text-gray-900 mb-1">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-gray-500">
              {isRegister
                ? "Join ChitkaraConnect as a student"
                : "Sign in to your student portal"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {isRegister && (
              <>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text" name="name" value={formData.name}
                    onChange={handleChange} required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Roll Number
                  </label>
                  <input
                    type="text" name="rollNumber" value={formData.rollNumber}
                    onChange={handleChange}
                    placeholder="e.g. 2110991234"
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Department
                    </label>
                    <select name="department" value={formData.department}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                    >
                      {["CSE","ECE","ME","CE","IT","MBA"].map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Year
                    </label>
                    <select name="year" value={formData.year}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition"
                    >
                      {[1,2,3,4].map((y) => (
                        <option key={y} value={y}>Year {y}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                University Email
              </label>
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} required
                placeholder="you@chitkara.edu.in"
                className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" value={formData.password}
                  onChange={handleChange} required
                  placeholder="Minimum 6 characters"
                  className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-3 text-sm outline-none transition pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3.5 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
            >
              {loading
                ? "Please wait..."
                : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          {/* Toggle */}
          <p className="text-center text-sm text-gray-500 mt-6">
            {isRegister ? "Already have an account?" : "New student?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 font-bold hover:underline"
            >
              {isRegister ? "Sign in" : "Create account"}
            </button>
          </p>

          <div className="text-center mt-4 pt-4 border-t border-gray-100">
            <Link to="/login/faculty"
              className="text-xs text-gray-400 hover:text-gray-600 transition">
              Are you faculty? → Faculty Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginStudent;
