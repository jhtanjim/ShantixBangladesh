import AccessDenied from "../components/ui/AccessDenied";

import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";



const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied if not admin
  if (user?.role !== "ADMIN") {
    return <AccessDenied />;
  }

  return <>{children}</>;
};

export default AdminRoute;
