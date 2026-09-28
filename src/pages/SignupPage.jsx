import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../utils/api";
import { signupSchema } from "../utils/validationSchemas";
import { getFieldErrors, getPasswordChecks } from "../utils/helpers";
import PasswordInput from "../components/PasswordInput";
import "../styles/AuthStyles.css";

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const passwordChecks = getPasswordChecks(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const result = signupSchema.safeParse({ name, email, password, confirmPassword });

    if (!result.success) {
      setErrors(getFieldErrors(result));
      return;
    }
    setIsLoading(true);
    const signupResult = await signupUser(name, email, password);
    setIsLoading(false);

    setMessage(signupResult.message);

    if (signupResult.success) {
      setTimeout(() => navigate("/login"), 1000);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Signup</h2>

        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label>Password</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="field-error">{errors.password}</p>}

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

          <div className="form-group">
            <label>Confirm Password</label>
            <PasswordInput
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {errors.confirmPassword && (
              <p className="field-error">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Signup"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="switch-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;