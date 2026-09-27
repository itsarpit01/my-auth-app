import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, loginUser } from "../utils/auth";
import { signupSchema, loginSchema } from "../utils/validationSchemas";
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

function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Live checklist ke liye — har render pe current password check hota hai
  const passwordChecks = getPasswordChecks(password);

  function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    if (isLogin) {
      const result = loginSchema.safeParse({ email, password });

      if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      const loginResult = loginUser(email, password);
      setMessage(loginResult.message);

      if (loginResult.success) {
        navigate("/settings");
      }
    } else {
      const result = signupSchema.safeParse({ name, email, password });

      if (!result.success) {
        const fieldErrors = {};
        result.error.issues.forEach((issue) => {
          fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
        return;
      }

      signupUser(name, email, password);
      setMessage("Signup successful! Please login now.");
      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p className="field-error">{errors.name}</p>}
            </div>
          )}

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

            {/* Sirf Signup mode me live checklist dikhao */}
            {!isLogin && (
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
            )}
          </div>

          <button type="submit" className="btn-primary">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            className="btn-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setErrors({});
            }}
          >
            {isLogin ? "Signup" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LandingPage;