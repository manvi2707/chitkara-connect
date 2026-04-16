// =============================================
// components/DeleteAccountModal.jsx
// =============================================
// A confirmation modal that asks the user to
// type their password before deleting their
// account. Used by both students (settings tab)
// and faculty (profile edit page).
//
// Props:
//   isOpen  — boolean, whether modal is visible
//   onClose — function, called when user cancels
//   onConfirm — async function(password), called with password
//   loading — boolean, shows spinner while deleting

import { useState } from "react";

const DeleteAccountModal = ({ isOpen, onClose, onConfirm, loading }) => {
  const [password,  setPassword]  = useState("");
  const [showPass,  setShowPass]  = useState(false);
  const [confirmed, setConfirmed] = useState(false); // checkbox

  // Reset state whenever modal opens
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!confirmed || !password) return;
    onConfirm(password);
  };

  const handleClose = () => {
    setPassword("");
    setShowPass(false);
    setConfirmed(false);
    onClose();
  };

  return (
    /* ── Overlay ── */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleClose}
    >
      {/* ── Modal box — stops click propagation ── */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Warning icon ── */}
        <div className="flex items-center justify-center w-14 h-14 bg-red-100 rounded-full mx-auto mb-4">
          <svg className="w-7 h-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </div>

        {/* ── Title ── */}
        <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
          Delete Account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-5 leading-relaxed">
          This action is <strong className="text-red-600">permanent</strong> and
          cannot be undone. All your data — meetings, messages, and profile —
          will be deleted forever.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ── Password field ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Enter your password to confirm
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your current password"
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent"
                autoComplete="current-password"
                required
              />
              {/* Show/hide toggle */}
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPass ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ── Checkbox confirmation ── */}
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <span className="text-sm text-gray-600">
              I understand this will permanently delete my account and all my data.
            </span>
          </label>

          {/* ── Action buttons ── */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!confirmed || !password || loading}
              className="flex-1 py-2.5 px-4 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Deleting…
                </>
              ) : (
                "Delete My Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
