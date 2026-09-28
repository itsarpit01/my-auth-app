import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../utils/api";
import { signupSchema } from "../utils/validationSchemas";
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

function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();
  const passwordChecks = getPasswordChecks(password);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const result = signupSchema.safeParse({ name, email, password });

    if (!result.success) {
      const fieldErrors = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    const signupResult = await signupUser(name, email, password);
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
            <input
              type="password"
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

          <button type="submit" className="btn-primary">
            Signup
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