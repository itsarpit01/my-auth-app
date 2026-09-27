import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../utils/auth";
import "../styles/AuthStyles.css";

function SettingsPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Settings</h2>

        <div className="user-info">
          <p><strong>Naam:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>

        <button onClick={handleLogout} className="btn-logout">
          Logout
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;