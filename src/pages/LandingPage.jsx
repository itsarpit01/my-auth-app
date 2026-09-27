import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, loginUser } from "../utils/auth";
import "../styles/AuthStyles.css";

function LandingPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (isLogin) {
      const result = loginUser(email, password);
      setMessage(result.message);

      if (result.success) {
        navigate("/settings");
      }
    } else {
      if (!name || !email || !password) {
        setMessage("Sab fields bharo!");
        return;
      }
      signupUser(name, email, password);
      setMessage("Signup successful! Ab login karo.");
      setIsLogin(true);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{isLogin ? "Login" : "Signup"}</h2>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Naam</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn-primary">
            {isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}

        <p className="switch-text">
          {isLogin ? "Account nahi hai?" : "Already account hai?"}{" "}
          <button
            className="btn-link"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Signup karo" : "Login karo"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default LandingPage;