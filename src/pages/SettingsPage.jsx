import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, updateUser } from "../utils/auth";
import { updateProfileSchema } from "../utils/validationSchemas";
import "../styles/AuthStyles.css";

function SettingsPage() {
  const [user, setUser] = useState(null);

  // Edit mode on/off karne ke liye
  const [isEditing, setIsEditing] = useState(false);

  // Form fields ke liye alag state (edit karte waqt)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Page load hote hi localStorage se user data nikaal lo
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    if (currentUser) {
      setName(currentUser.name);
      setEmail(currentUser.email);
    }
  }, []);

  function handleLogout() {
    logoutUser();
    navigate("/");
  }

  // Edit button dabane pe - form fields ko current data se bhar do
  function handleEditClick() {
    setName(user.name);
    setEmail(user.email);
    setErrors({});
    setMessage("");
    setIsEditing(true);
  }

  // Cancel button dabane pe
  function handleCancel() {
    setIsEditing(false);
    setErrors({});
  }

  // Save button dabane pe (form submit)
  function handleSave(e) {
    e.preventDefault();
    setErrors({});

    const result = updateProfileSchema.safeParse({ name, email });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const updateResult = updateUser({ name, email });

    if (updateResult.success) {
      setUser({ ...user, name, email }); // UI turant update karne ke liye
      setMessage(updateResult.message);
      setIsEditing(false);
    }
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Settings</h2>

        {/* ---------- VIEW MODE (default) ---------- */}
        {!isEditing && (
          <>
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>

            {message && <p className="auth-message success-message">{message}</p>}

            <button onClick={handleEditClick} className="btn-primary">
              Edit Profile
            </button>

            <button onClick={handleLogout} className="btn-logout" style={{ marginTop: "12px" }}>
              Logout
            </button>
          </>
        )}

        {/* ---------- EDIT MODE (form) ---------- */}
        {isEditing && (
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="field-error">{errors.email}</p>}
            </div>

            <button type="submit" className="btn-primary">
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="btn-logout"
              style={{ marginTop: "12px" }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default SettingsPage;