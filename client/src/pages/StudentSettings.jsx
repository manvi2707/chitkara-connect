// =============================================
// pages/StudentSettings.jsx
// =============================================
// Full student settings page with:
//   1. Profile editing (name, year, rollNumber)
//   2. Profile photo upload
//   3. Change password
//   4. Delete account (Danger Zone)

import { useState, useEffect } from "react";
import { useNavigate }         from "react-router-dom";
import { useAuth }             from "../context/AuthContext";
import { useToast }            from "../components/Toast";
import {
  getStudentProfile,
  updateStudentProfile,
  changePassword,
  deleteAccount,
} from "../utils/api";
import UserAvatar         from "../components/UserAvatar";
import PhotoUpload        from "../components/PhotoUpload";
import DeleteAccountModal from "../components/DeleteAccountModal";

// ── Small section card wrapper ─────────────────
const Section = ({ title, icon, children, color = "gray" }) => {
  const colors = {
    gray:  "bg-gray-50 border-gray-200",
    blue:  "bg-blue-50 border-blue-100",
    amber: "bg-amber-50 border-amber-200",
    red:   "bg-red-50 border-red-200",
  };
  const textColors = {
    gray: "text-gray-700", blue: "text-blue-800",
    amber: "text-amber-800", red: "text-red-700",
  };
  return (
    <div className={`border-2 rounded-2xl p-5 ${colors[color]}`}>
      <h2 className={`font-bold text-sm mb-4 flex items-center gap-2 ${textColors[color]}`}>
        <span>{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
};

const StudentSettings = () => {
  const { user, profilePhoto, logout, login, token } = useAuth();
  const toast    = useToast();
  const navigate = useNavigate();

  // ── State ─────────────────────────────────────
  const [fetching,  setFetching]  = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [delLoading, setDelLoading] = useState(false);

  const [showPhotoUpload,  setShowPhotoUpload]  = useState(false);
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [showCurrentPass,  setShowCurrentPass]  = useState(false);
  const [showNewPass,      setShowNewPass]      = useState(false);
  const [showConfirmPass,  setShowConfirmPass]  = useState(false);

  // Profile form state
  const [profile, setProfile] = useState({
    name:       "",
    year:       1,
    rollNumber: "",
  });

  // Password form state
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });

  // ── Load profile on mount ──────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const res = await getStudentProfile();
        const s   = res.data;
        setProfile({
          name:       s.name       || "",
          year:       s.year       || 1,
          rollNumber: s.rollNumber || "",
        });
      } catch (err) {
        toast.error("Load failed", "Could not fetch your profile.");
      } finally {
        setFetching(false);
      }
    };
    load();
  }, []);

  // ── Save profile ───────────────────────────────
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateStudentProfile(profile);
      // Update the name in auth context so Navbar reflects it immediately
      login({ ...user, name: res.data.student.name }, token);
      toast.success("Profile saved!", "Your information has been updated.");
    } catch (err) {
      toast.error("Save failed", err.response?.data?.message || "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error("Passwords don't match", "New password and confirmation must be identical.");
      return;
    }
    setPwLoading(true);
    try {
      await changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      });
      toast.success("Password changed!", "Please log in again with your new password.");
      // Force re-login for security
      setTimeout(() => {
        logout();
        navigate("/login/student");
      }, 1500);
    } catch (err) {
      toast.error("Failed", err.response?.data?.message || "Could not change password.");
    } finally {
      setPwLoading(false);
    }
  };

  // ── Delete account ─────────────────────────────
  const handleDeleteAccount = async (password) => {
    setDelLoading(true);
    try {
      await deleteAccount({ password });
      toast.success("Account deleted", "Your account has been permanently deleted.");
      logout();
      navigate("/");
    } catch (err) {
      toast.error("Failed", err.response?.data?.message || "Check your password and try again.");
    } finally {
      setDelLoading(false);
      setShowDeleteModal(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 w-full max-w-2xl">
        <div className="h-8 w-40 bg-gray-200 rounded-lg animate-pulse mb-6" />
        {[1,2,3].map(i => (
          <div key={i} className="h-32 bg-gray-100 rounded-2xl animate-pulse mb-4" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="p-4 sm:p-6 w-full max-w-2xl overflow-x-hidden">

        {/* ── Page header ── */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
        </div>

        {/* ── 1. Profile photo + read-only info ── */}
        <div className="flex items-center gap-4 bg-white border-2 border-gray-100 rounded-2xl p-5 mb-4 shadow-sm">
          <div className="relative flex-shrink-0">
            <UserAvatar
              name={user?.name}
              photo={profilePhoto}
              role="student"
              size="2xl"
              shape="circle"
            />
            <button
              onClick={() => setShowPhotoUpload(true)}
              title="Change photo"
              className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-xs shadow-md transition"
            >
              📷
            </button>
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 text-base truncate">{user?.name}</p>
            <p className="text-sm text-gray-500 truncate">{user?.email}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                {user?.department}
              </span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-4">

          {/* ── 2. Editable profile info ── */}
          <Section title="Personal Information" icon="👤" color="blue">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  required
                  placeholder="Your full name"
                  className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                />
              </div>

              {/* Year + Roll Number side by side */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Year</label>
                  <select
                    value={profile.year}
                    onChange={(e) => setProfile({ ...profile, year: Number(e.target.value) })}
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  >
                    {[1,2,3,4,5].map((y) => (
                      <option key={y} value={y}>Year {y}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Roll Number
                  </label>
                  <input
                    type="text"
                    value={profile.rollNumber}
                    onChange={(e) => setProfile({ ...profile, rollNumber: e.target.value })}
                    placeholder="e.g. 2110991234"
                    className="w-full border-2 border-gray-200 focus:border-blue-500 rounded-xl px-4 py-2.5 text-sm outline-none transition"
                  />
                </div>
              </div>

              {/* Read-only fields for info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">
                    Email <span className="text-xs font-normal">(fixed)</span>
                  </label>
                  <input
                    type="text" value={user?.email} readOnly
                    className="w-full border-2 border-gray-100 bg-gray-50 text-gray-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-400 mb-1.5">
                    Department <span className="text-xs font-normal">(fixed)</span>
                  </label>
                  <input
                    type="text" value={user?.department} readOnly
                    className="w-full border-2 border-gray-100 bg-gray-50 text-gray-400 rounded-xl px-4 py-2.5 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2.5 rounded-xl font-bold text-sm transition"
              >
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </form>
          </Section>

          {/* ── 3. Change Password ── */}
          <Section title="Change Password" icon="🔒" color="amber">
            <form onSubmit={handleChangePassword} className="space-y-3">
              {/* Current password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    value={pwForm.currentPassword}
                    onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                    placeholder="Your current password"
                    required
                    className="w-full border-2 border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm outline-none transition pr-12"
                  />
                  <button type="button" onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
                    {showCurrentPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={pwForm.newPassword}
                    onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                    placeholder="Minimum 6 characters"
                    required
                    className="w-full border-2 border-gray-200 focus:border-amber-400 rounded-xl px-4 py-2.5 text-sm outline-none transition pr-12"
                  />
                  <button type="button" onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
                    {showNewPass ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Confirm new password */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    value={pwForm.confirmPassword}
                    onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                    placeholder="Repeat new password"
                    required
                    className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm outline-none transition pr-12 ${
                      pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword
                        ? "border-red-400 focus:border-red-400"
                        : "border-gray-200 focus:border-amber-400"
                    }`}
                  />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600">
                    {showConfirmPass ? "Hide" : "Show"}
                  </button>
                </div>
                {pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={pwLoading || (pwForm.confirmPassword && pwForm.newPassword !== pwForm.confirmPassword)}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold text-sm transition"
              >
                {pwLoading ? "Changing..." : "🔑 Change Password"}
              </button>
            </form>
          </Section>

          {/* ── 4. Danger Zone ── */}
          <Section title="Danger Zone" icon="⚠️" color="red">
            <p className="text-xs text-red-500 mb-4 leading-relaxed">
              Deleting your account is <strong>permanent</strong> and cannot be undone.
              All your meetings, messages, and data will be erased forever.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-6 py-2.5 text-sm font-semibold text-red-700 border-2 border-red-300 hover:bg-red-100 rounded-xl transition"
            >
              🗑️ Delete My Account
            </button>
          </Section>

        </div>
      </div>

      {/* Modals */}
      {showPhotoUpload && (
        <PhotoUpload onClose={() => setShowPhotoUpload(false)} />
      )}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={delLoading}
      />
    </>
  );
};

export default StudentSettings;
