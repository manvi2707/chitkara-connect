// =============================================
// Toast.jsx — Beautiful Toast Notifications
// =============================================
// Replaces all plain alert() and basic error divs
// Usage: import { useToast } from "./Toast"
//        const toast = useToast()
//        toast.success("Profile saved!")
//        toast.error("Something went wrong")
//        toast.info("Meeting request sent!")

import { createContext, useContext, useState, useCallback } from "react";

// Context to share toast across entire app
const ToastContext = createContext();

// Individual toast item component
const ToastItem = ({ toast, onRemove }) => {
  const styles = {
    success: {
      bg: "bg-green-500",
      icon: "✅",
      bar: "bg-green-300",
    },
    error: {
      bg: "bg-red-500",
      icon: "❌",
      bar: "bg-red-300",
    },
    info: {
      bg: "bg-blue-500",
      icon: "ℹ️",
      bar: "bg-blue-300",
    },
    warning: {
      bg: "bg-yellow-500",
      icon: "⚠️",
      bar: "bg-yellow-300",
    },
  };

  const style = styles[toast.type] || styles.info;

  return (
    <div
      className={`
        ${style.bg} text-white rounded-xl shadow-2xl p-4 min-w-72 max-w-sm
        flex items-start gap-3 relative overflow-hidden
        animate-slideIn
      `}
    >
      {/* Icon */}
      <span className="text-lg flex-shrink-0 mt-0.5">{style.icon}</span>

      {/* Message */}
      <div className="flex-1">
        <p className="font-semibold text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-white/80 text-xs mt-0.5">{toast.message}</p>
        )}
      </div>

      {/* Close button */}
      <button
        onClick={() => onRemove(toast.id)}
        className="text-white/70 hover:text-white text-lg leading-none flex-shrink-0"
      >
        ✕
      </button>

      {/* Progress bar — shrinks over time */}
      <div
        className={`absolute bottom-0 left-0 h-1 ${style.bar} rounded-full animate-shrink`}
        style={{ animationDuration: `${toast.duration}ms` }}
      />
    </div>
  );
};

// Provider — wraps the whole app
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // Remove a toast by id
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Add a new toast
  const addToast = useCallback((type, title, message, duration = 3000) => {
    const id = Date.now() + Math.random();
    const toast = { id, type, title, message, duration };

    setToasts((prev) => [...prev, toast]);

    // Auto remove after duration
    setTimeout(() => removeToast(id), duration);
  }, [removeToast]);

  // Helper functions
  const toast = {
    success: (title, message) => addToast("success", title, message),
    error:   (title, message) => addToast("error",   title, message),
    info:    (title, message) => addToast("info",    title, message),
    warning: (title, message) => addToast("warning", title, message),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Toast container — fixed at bottom right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Custom hook — any component calls: const toast = useToast()
export const useToast = () => useContext(ToastContext);
