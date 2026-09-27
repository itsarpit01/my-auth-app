import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SettingsPage from "../pages/SettingsPage";
import { isUserLoggedIn } from "../utils/auth";

function ProtectedRoute({ children }) {
  const loggedIn = isUserLoggedIn();

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;