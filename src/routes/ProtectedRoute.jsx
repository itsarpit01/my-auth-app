import { Navigate, Outlet } from "react-router-dom";
import { isUserLoggedIn } from "../api/authApi";

function ProtectedRoute() {
  if (!isUserLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;