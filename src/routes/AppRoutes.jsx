import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SettingsPage from "../pages/SettingsPage";
import { isUserLoggedIn } from "../utils/api";

// Login nahi hai to /login pe bhej deta hai
function ProtectedRoute({ children }) {
  if (!isUserLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

// Login already hai to /settings pe bhej deta hai
function PublicRoute({ children }) {
  if (isUserLoggedIn()) {
    return <Navigate to="/settings" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* ---------- PUBLIC ROUTES GROUP ---------- */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* ---------- PROTECTED ROUTES GROUP ---------- */}
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