// =============================================
// ProtectedRoute.jsx — Guards private pages
// Wraps any page that requires login
// =============================================

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useAuth();

  // Case 1: Not logged in at all → go to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Case 2: Wrong role → go to home
  // e.g. a student trying to access /faculty/dashboard
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  // Case 3: All good → show the page
  return children;
};

export default ProtectedRoute;
