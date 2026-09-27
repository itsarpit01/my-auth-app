// Yeh function ek naya user localStorage me save karta hai (Signup ke time)
export function signupUser(name, email, password) {
  const newUser = { name, email, password };
  localStorage.setItem("user", JSON.stringify(newUser));
}

// Yeh function check karta hai ki email + password sahi hai ya nahi (Login ke time)
export function loginUser(email, password) {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return { success: false, message: "Koi account nahi mila. Pehle Signup karo." };
  }

  const userData = JSON.parse(savedUser);

  if (userData.email === email && userData.password === password) {
    localStorage.setItem("isLoggedIn", "true");
    return { success: true, message: "Login successful!" };
  } else {
    return { success: false, message: "Email ya password galat hai." };
  }
}

// Yeh function batata hai ki user login hai ya nahi
export function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// Yeh function current user ka data nikaal ke deta hai (Settings page ke liye)
export function getCurrentUser() {
  const savedUser = localStorage.getItem("user");
  return savedUser ? JSON.parse(savedUser) : null;
}

// Yeh function logout karta hai
export function logoutUser() {
  localStorage.removeItem("isLoggedIn");
}