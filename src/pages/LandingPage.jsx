import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, loginUser } from "../utils/auth";

function LandingPage() {
  // Yeh state batata hai ki abhi Signup form dikhana hai ya Login form
  const [isLogin, setIsLogin] = useState(true);

  // Form ke input fields ke liye state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error/success message dikhane ke liye
  const [message, setMessage] = useState("");

  // Page change karne ke liye (login hone ke baad Settings pe bhejna)
  const navigate = useNavigate();

  // Jab form submit ho (Signup ya Login button dabaya jaye)
  function handleSubmit(e) {
    e.preventDefault(); // page reload hone se roकता है

    if (isLogin) {
      // ----- LOGIN LOGIC -----
      const result = loginUser(email, password);
      setMessage(result.message);

      if (result.success) {
        navigate("/settings"); // login sahi hua to Settings page pe bhejo
      }
    } else {
      // ----- SIGNUP LOGIC -----
      if (!name || !email || !password) {
        setMessage("Sab fields bharo!");
        return;
      }
      signupUser(name, email, password);
      setMessage("Signup successful! Ab login karo.");
      setIsLogin(true); // signup ke baad login form pe switch kardo
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", fontFamily: "Arial" }}>
      <h2>{isLogin ? "Login" : "Signup"}</h2>

      <form onSubmit={handleSubmit}>
        {/* Naam sirf Signup me chahiye, Login me nahi */}
        {!isLogin && (
          <div style={{ marginBottom: "10px" }}>
            <label>Naam: </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}

        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>Password: </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>

      {/* Message dikhana (error ya success) */}
      {message && <p style={{ color: "red" }}>{message}</p>}

      {/* Login/Signup ke beech switch karne ka button */}
      <p>
        {isLogin ? "Account nahi hai?" : "Already account hai?"}{" "}
        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage("");
          }}
        >
          {isLogin ? "Signup karo" : "Login karo"}
        </button>
      </p>
    </div>
  );
}

export default LandingPage;