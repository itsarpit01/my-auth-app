import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import SettingsPage from "../pages/SettingsPage";
import { isUserLoggedIn } from "../utils/auth";

// ---------- PROTECTED ROUTE WRAPPER ----------
// Ye component check karta hai ki user login hai ya nahi
// Agar login nahi hai, to LandingPage pe wapas bhej deta hai
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
      {/* ---------- PUBLIC ROUTES GROUP ---------- */}
      {/* Ye routes koi bhi dekh sakta hai, login ki zaroorat nahi */}
      <Route path="/" element={<LandingPage />} />

      {/* ---------- PROTECTED ROUTES GROUP ---------- */}
      {/* Ye routes sirf tab dikhenge jab user login ho */}
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