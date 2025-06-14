import { useAuth } from "../Context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import AccessDenied from "./AccessDenied";
import React from "react";


const ProtectedRoute = ({ 
  children, 
  requiredRole = "USER", 
  requireAuth = true 
}) => {
  const { user, token } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (requireAuth && !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (requiredRole && user?.role !== requiredRole) {
    // If user is trying to access admin routes without admin role
    if (requiredRole === "ADMIN" && user?.role !== "ADMIN") {
      return <AccessDenied />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
