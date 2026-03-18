// =============================================
// context/AuthContext.jsx — Fixed Photo Persist
// =============================================
// Fix: on login, profilePhoto is read from
// the server response and saved to localStorage
// So photo survives logout → login

import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  // Load user from localStorage on first load
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("chitkaraUser");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("chitkaraToken") || null;
  });

  // ── Load photo from localStorage on first load ──
  // Priority order:
  // 1. chitkaraPhoto (set after upload)
  // 2. user.profilePhoto (set after login from server)
  // 3. empty string (no photo)
  const [profilePhoto, setProfilePhoto] = useState(() => {
    const savedPhoto = localStorage.getItem("chitkaraPhoto");
    if (savedPhoto) return savedPhoto;

    // Fallback: read from saved user object
    const savedUser = localStorage.getItem("chitkaraUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      return parsed.profilePhoto || "";
    }
    return "";
  });

  // ── LOGIN ────────────────────────────────────
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem("chitkaraUser", JSON.stringify(userData));
    localStorage.setItem("chitkaraToken", authToken);

    // ← Load photo from server login response
    // This is the key fix — server now returns profilePhoto
    const photo = userData.profilePhoto || "";
    setProfilePhoto(photo);

    if (photo) {
      localStorage.setItem("chitkaraPhoto", photo);
    } else {
      localStorage.removeItem("chitkaraPhoto");
    }
  };

  // ── LOGOUT ───────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    setProfilePhoto("");
    localStorage.removeItem("chitkaraUser");
    localStorage.removeItem("chitkaraToken");
    localStorage.removeItem("chitkaraPhoto");
  };

  // ── UPDATE PHOTO ─────────────────────────────
  // Called after photo upload — updates everywhere instantly
  const updatePhoto = (newPhotoUrl) => {
    setProfilePhoto(newPhotoUrl);

    // Also update the saved user object so it persists after refresh
    const savedUser = localStorage.getItem("chitkaraUser");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      parsed.profilePhoto = newPhotoUrl;
      localStorage.setItem("chitkaraUser", JSON.stringify(parsed));
    }

    if (newPhotoUrl) {
      localStorage.setItem("chitkaraPhoto", newPhotoUrl);
    } else {
      localStorage.removeItem("chitkaraPhoto");
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      profilePhoto,
      login,
      logout,
      updatePhoto,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
