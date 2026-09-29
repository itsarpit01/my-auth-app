import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/api";
import { loginSchema } from "../utils/validationSchemas";
import { getFieldErrors } from "../utils/helpers";
import PasswordInput from "../components/PasswordInput";
import "../styles/AuthStyles.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setMessage("");

    const result = loginSchema.safeParse({ email, password });

    if (!result.success) {
      setErrors(getFieldErrors(result));
      return;
    }

    setIsLoading(true);
    const loginResult = await loginUser(email, password);
    setIsLoading(false);

    setMessage(loginResult.message);

    if (loginResult.success) {
      navigate("/todos");
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
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
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="switch-text">
          Don't have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;