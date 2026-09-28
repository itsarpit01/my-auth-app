
export function signupUser(name, email, password) {
  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return { success: false, message: "This email is already registered." };
  }

  const newUser = { name, email, password };
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  return { success: true, message: "Signup successful! Please login now." };
}

export function loginUser(email, password) {
  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  const matchedUser = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!matchedUser) {
    return { success: false, message: "Invalid email or password." };
  }

  localStorage.setItem("currentUserEmail", email);
  localStorage.setItem("isLoggedIn", "true");

  return { success: true, message: "Login successful!" };
}

export function isUserLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

export function getCurrentUser() {
  const currentEmail = localStorage.getItem("currentUserEmail");
  if (!currentEmail) return null;

  const usersData = localStorage.getItem("users");
  const users = usersData ? JSON.parse(usersData) : [];

  return users.find((u) => u.email === currentEmail) || null;
}

export function logoutUser() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUserEmail");
}

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

  if (updatedData.email && updatedData.email !== currentEmail) {
    const emailTaken = users.some(
      (u, idx) => u.email === updatedData.email && idx !== userIndex
    );
    if (emailTaken) {
      return { success: false, message: "This email is already in use by another account." };
    }
  }

  users[userIndex] = { ...users[userIndex], ...updatedData };
  localStorage.setItem("users", JSON.stringify(users));

  if (updatedData.email && updatedData.email !== currentEmail) {
    localStorage.setItem("currentUserEmail", updatedData.email);
  }

  return { success: true, message: "Profile updated successfully!" };
}

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