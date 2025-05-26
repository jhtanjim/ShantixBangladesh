import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }:any) => {
  const { token } = useAuthContext();

  if (!token) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
