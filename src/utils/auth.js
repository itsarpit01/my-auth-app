// ---------- SIGNUP ----------
// Ab hum ek "users" ARRAY store karenge, single user nahi
export function signupUser(name, email, password) {
  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  // Check karo email pehle se exist to nahi karta
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return { success: false, message: "This email is already registered." };
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return { success: true, message: "Signup successful! Please login now." };
}

// ---------- LOGIN ----------
export function loginUser(email, password) {
  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  const matchedUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!matchedUser) {
    return { success: false, message: "Invalid email or password." };
  }

  // Current logged-in user ka email session me save karo
  localStorage.setItem("currentUserEmail", email);
  localStorage.setItem("isLoggedIn", "true");

  return { success: true, message: "Login successful!" };
}

// ---------- CHECK LOGIN STATUS ----------
export function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

// ---------- GET CURRENT LOGGED-IN USER ----------
export function getCurrentUser() {
  const currentEmail = localStorage.getItem("currentUserEmail");
  if (!currentEmail) return null;

  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  return users.find((u) => u.email === currentEmail) || null;
}

// ---------- LOGOUT ----------
export function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUserEmail");
}

// ---------- UPDATE USER PROFILE ----------
export function updateUser(updatedData) {
  const currentEmail = localStorage.getItem("currentUserEmail");
  if (!currentEmail) {
    return { success: false, message: "No user logged in." };
  }

  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  const userIndex = users.findIndex((u) => u.email === currentEmail);
  if (userIndex === -1) {
    return { success: false, message: "User not found." };
  }

  // Agar email change ho raha hai, to check karo naya email kisi aur ka to nahi hai
  if (updatedData.email && updatedData.email !== currentEmail) {
    const emailTaken = users.some(
      (u, idx) => u.email === updatedData.email && idx !== userIndex
    );
    if (emailTaken) {
      return { success: false, message: "This email is already in use by another account." };
    }
  }

  // User data update karo
  users[userIndex] = { ...users[userIndex], ...updatedData };
  localStorage.setItem("users", JSON.stringify(users));

  // Agar email change hua hai, to current session ka email bhi update karo
  if (updatedData.email && updatedData.email !== currentEmail) {
    localStorage.setItem("currentUserEmail", updatedData.email);
  }

  return { success: true, message: "Profile updated successfully!" };
}

// ---------- CHANGE PASSWORD ----------
export function changePassword(currentPassword, newPassword) {
  const currentEmail = localStorage.getItem("currentUserEmail");
  if (!currentEmail) {
    return { success: false, message: "No user logged in." };
  }

  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  const userIndex = users.findIndex((u) => u.email === currentEmail);
  if (userIndex === -1) {
    return { success: false, message: "User not found." };
  }

  if (users[userIndex].password !== currentPassword) {
    return { success: false, message: "Current password is incorrect." };
  }

  users[userIndex].password = newPassword;
  localStorage.setItem("users", JSON.stringify(users));

  return { success: true, message: "Password changed successfully!" };
}