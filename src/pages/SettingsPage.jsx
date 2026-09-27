import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, updateUser, changePassword } from "../utils/auth";
import { updateProfileSchema, changePasswordSchema } from "../utils/validationSchemas";
import "../styles/AuthStyles.css";

function getPasswordChecks(pwd) {
  return {
    length: pwd.length >= 8,
    uppercase: /[A-Z]/.test(pwd),
    lowercase: /[a-z]/.test(pwd),
    number: /[0-9]/.test(pwd),
    special: /[^A-Za-z0-9]/.test(pwd),
  };
}

function SettingsPage() {
  const [user, setUser] = useState(null);

  // View / Edit Profile / Change Password - teen modes
  const [mode, setMode] = useState("view"); // "view" | "editProfile" | "changePassword"

  // Profile edit ke liye states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Password change ke liye states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const passwordChecks = getPasswordChecks(newPassword);

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
    navigate("/login");
  }

  // ---------- EDIT PROFILE MODE ----------
  function handleEditProfileClick() {
    setName(user.name);
    setEmail(user.email);
    setErrors({});
    setMessage("");
    setMode("editProfile");
  }

  function handleSaveProfile(e) {
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
      setUser({ ...user, name, email });
      setMessage(updateResult.message);
      setMode("view");
    } else {
      setMessage(updateResult.message);
    }
  }

  // ---------- CHANGE PASSWORD MODE ----------
  function handleChangePasswordClick() {
    setCurrentPassword("");
    setNewPassword("");
    setErrors({});
    setMessage("");
    setMode("changePassword");
  }

  function handleSavePassword(e) {
    e.preventDefault();
    setErrors({});

    const result = changePasswordSchema.safeParse({ currentPassword, newPassword });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const changeResult = changePassword(currentPassword, newPassword);

    if (changeResult.success) {
      setMessage(changeResult.message);
      setMode("view");
      setCurrentPassword("");
      setNewPassword("");
    } else {
      // Galat current password jaisa error yahan dikhega
      setErrors({ currentPassword: changeResult.message });
    }
  }

  function handleCancel() {
    setMode("view");
    setErrors({});
  }

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Settings</h2>

        {/* ---------- VIEW MODE ---------- */}
        {mode === "view" && (
          <>
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </div>

            {message && <p className="auth-message success-message">{message}</p>}

            <button onClick={handleEditProfileClick} className="btn-primary">
              Edit Profile
            </button>

            <button
              onClick={handleChangePasswordClick}
              className="btn-primary"
              style={{ marginTop: "12px" }}
            >
              Change Password
            </button>

            <button onClick={handleLogout} className="btn-logout" style={{ marginTop: "12px" }}>
              Logout
            </button>
          </>
        )}

        {/* ---------- EDIT PROFILE MODE ---------- */}
        {mode === "editProfile" && (
          <form onSubmit={handleSaveProfile}>
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

        {/* ---------- CHANGE PASSWORD MODE ---------- */}
        {mode === "changePassword" && (
          <form onSubmit={handleSavePassword}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              {errors.currentPassword && (
                <p className="field-error">{errors.currentPassword}</p>
              )}
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              {errors.newPassword && <p className="field-error">{errors.newPassword}</p>}

              <ul className="password-checklist">
                <li className={passwordChecks.length ? "check-pass" : "check-fail"}>
                  {passwordChecks.length ? "✓" : "○"} At least 8 characters
                </li>
                <li className={passwordChecks.uppercase ? "check-pass" : "check-fail"}>
                  {passwordChecks.uppercase ? "✓" : "○"} One uppercase letter (A-Z)
                </li>
                <li className={passwordChecks.lowercase ? "check-pass" : "check-fail"}>
                  {passwordChecks.lowercase ? "✓" : "○"} One lowercase letter (a-z)
                </li>
                <li className={passwordChecks.number ? "check-pass" : "check-fail"}>
                  {passwordChecks.number ? "✓" : "○"} One number (0-9)
                </li>
                <li className={passwordChecks.special ? "check-pass" : "check-fail"}>
                  {passwordChecks.special ? "✓" : "○"} One special character (!@#$)
                </li>
              </ul>
            </div>

            <button type="submit" className="btn-primary">
              Update Password
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