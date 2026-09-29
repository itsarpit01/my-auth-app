import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  logoutUser,
  fetchProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../utils/api";
import {
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "../utils/validationSchemas";
import { getFieldErrors } from "../utils/helpers";
import PasswordInput from "../components/PasswordInput";
import "../styles/DashboardStyles.css";

function SettingsPage() {
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("view");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [deletePassword, setDeletePassword] = useState("");

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

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

  function handleDeleteAccountClick() {
    setDeletePassword("");
    setErrors({});
    setMessage("");
    setMode("deleteAccount");
  }

  async function handleConfirmDelete(e) {
    e.preventDefault();
    setErrors({});

    const result = deleteAccountSchema.safeParse({ password: deletePassword });
    if (!result.success) {
      setErrors(getFieldErrors(result));
      return;
    }

    setIsLoading(true);
    const deleteResult = await deleteAccount(deletePassword);
    setIsLoading(false);

    if (deleteResult.success) {
      navigate("/login");
    } else {
      setErrors({ password: deleteResult.message });
    }
  }

  function handleCancel() {
    setMode("view");
    setErrors({});
  }

  if (!user) {
    return (
      <DashboardLayout>
        <p className="table-message">Loading profile...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="settings-page-wrapper">
        <div className="todo-header">
          <h1>Account Settings</h1>
          <p>Manage your personal profile and security preferences.</p>
        </div>

        <div className="settings-card">
          {mode === "view" && (
            <>
              <div className="settings-info-list">
                <div className="settings-info-row">
                  <span className="settings-label">Full Name</span>
                  <span className="settings-value">{user.name}</span>
                </div>
                <div className="settings-info-row">
                  <span className="settings-label">Email Address</span>
                  <span className="settings-value">{user.email}</span>
                </div>
              </div>

              {message && <p className="settings-success-message">{message}</p>}

              <div className="settings-btn-group">
                <button onClick={handleEditProfileClick} className="btn-theme-primary">
                  Edit Profile
                </button>
                <button onClick={handleChangePasswordClick} className="btn-theme-secondary">
                  Change Password
                </button>
              </div>
            </>
          )}

          {mode === "editProfile" && (
            <form onSubmit={handleSaveProfile} className="settings-form">
              <div className="settings-form-group">
                <label>Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                {errors.name && <p className="field-error">{errors.name}</p>}
              </div>

              <div className="settings-form-group">
                <label>Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="field-error">{errors.email}</p>}
              </div>

              {message && <p className="field-error">{message}</p>}

              <div className="settings-btn-group">
                <button type="submit" className="btn-theme-primary" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
                <button type="button" onClick={handleCancel} className="btn-theme-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {mode === "changePassword" && (
            <form onSubmit={handleSavePassword} className="settings-form">
              <div className="settings-form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                {errors.currentPassword && <p className="field-error">{errors.currentPassword}</p>}
              </div>

              <div className="settings-form-group">
                <label>New Password</label>
                <PasswordInput value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                {errors.newPassword && <p className="field-error">{errors.newPassword}</p>}
              </div>

              <div className="settings-btn-group">
                <button type="submit" className="btn-theme-primary" disabled={isLoading}>
                  {isLoading ? "Updating..." : "Update Password"}
                </button>
                <button type="button" onClick={handleCancel} className="btn-theme-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {mode === "deleteAccount" && (
            <form onSubmit={handleConfirmDelete} className="settings-form">
              <p className="danger-warning">
                This will permanently deactivate your account. You will be logged out and won't
                be able to log back in with these credentials. This cannot be undone.
              </p>

              <div className="settings-form-group">
                <label>Enter your password to confirm</label>
                <PasswordInput value={deletePassword} onChange={(e) => setDeletePassword(e.target.value)} />
                {errors.password && <p className="field-error">{errors.password}</p>}
              </div>

              <div className="settings-btn-group">
                <button type="submit" className="btn-danger" disabled={isLoading}>
                  {isLoading ? "Deleting..." : "Delete My Account"}
                </button>
                <button type="button" onClick={handleCancel} className="btn-theme-secondary">
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Danger zone: sirf view mode me dikhta hai, upar wale buttons se alag rakha hai */}
          {mode === "view" && (
            <div className="danger-zone">
              <button onClick={handleDeleteAccountClick} className="btn-danger-outline">
                Delete Account
              </button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default SettingsPage;