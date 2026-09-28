import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {logoutUser,fetchProfile,  updateProfile,changePassword,} from "../utils/api";
import { updateProfileSchema, changePasswordSchema } from "../utils/validationSchemas";
import { getFieldErrors } from "../utils/helpers";
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
  const [mode, setMode] = useState("view"); 

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const passwordChecks = getPasswordChecks(newPassword);

  useEffect(() => {
    async function loadProfile() {
      const result = await fetchProfile();

      if (result.success) {
        setUser(result.user);
        setName(result.user.name);
        setEmail(result.user.email);
      } else {

        logoutUser();
        navigate("/login");
      }
    }

    loadProfile();
  }, [navigate]);

  function handleLogout() {
    logoutUser();
    navigate("/login");
  }

  function handleEditProfileClick() {
    setName(user.name);
    setEmail(user.email);
    setErrors({});
    setMessage("");
    setMode("editProfile");
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setErrors({});

    const result = updateProfileSchema.safeParse({ name, email });

    if (!result.success) {
  setErrors(getFieldErrors(result));
  return;
}

    setIsLoading(true);
    const updateResult = await updateProfile(name, email);
    setIsLoading(false);

    if (updateResult.success) {
      setUser(updateResult.user);
      setMessage(updateResult.message);
      setMode("view");
    } else {
      setMessage(updateResult.message);
    }
  }

  function handleChangePasswordClick() {
    setCurrentPassword("");
    setNewPassword("");
    setErrors({});
    setMessage("");
    setMode("changePassword");
  }

  async function handleSavePassword(e) {
    e.preventDefault();
    setErrors({});

    const result = changePasswordSchema.safeParse({ currentPassword, newPassword });

    if (!result.success) {
  setErrors(getFieldErrors(result));
  return;
}

    setIsLoading(true);
    const changeResult = await changePassword(currentPassword, newPassword);
    setIsLoading(false);

    if (changeResult.success) {
      setMessage(changeResult.message);
      setMode("view");
      setCurrentPassword("");
      setNewPassword("");
    } else {
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

            {message && <p className="auth-message">{message}</p>}

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
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

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update Password"}
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