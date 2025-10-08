import React from "react";
import { Navigate } from "react-router-dom";

// ✅ This component protects private routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
