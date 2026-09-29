import { Navigate, Outlet } from "react-router-dom";
import { isUserLoggedIn } from "../api/authApi";

function PublicRoute() {
  if (isUserLoggedIn()) {
    return <Navigate to="/todos" replace />;
  }

  return <Outlet />;
}

export default PublicRoute;