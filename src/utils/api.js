// Backend server ka base URL
const API_URL = "http://localhost:5000/api/auth";

// Common error handler - fetch fail hone pe (server down, no internet, etc.)
function handleNetworkError(error) {
  console.error("Network error:", error);
  return {
    success: false,
    message: "Unable to connect to server. Please check your internet connection or try again later.",
  };
}

// ---------- SIGNUP ----------
export async function signupUser(name, email, password) {
  try {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    return data; // { success, message }
  } catch (error) {
    return handleNetworkError(error);
  }
}

// ---------- LOGIN ----------
export async function loginUser(email, password) {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    // Agar login successful hai, to token aur user data localStorage me save karo
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data; // { success, message, token, user }
  } catch (error) {
    return handleNetworkError(error);
  }
}

// ---------- CHECK LOGIN STATUS ----------
export function isUserLoggedIn() {
  return !!localStorage.getItem("token");
}

// ---------- GET CURRENT USER (localStorage se, jo login ke time save hua tha) ----------
export function getCurrentUser() {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

// ---------- LOGOUT ----------
export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

// ---------- GET PROFILE (backend se, token verify karke) ----------
export async function fetchProfile() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data; // { success, user }
  } catch (error) {
    return handleNetworkError(error);
  }
}

// ---------- UPDATE PROFILE ----------
export async function updateProfile(name, email) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/update-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, email }),
    });

    const data = await response.json();

    // Agar update successful hai, to localStorage ka user data bhi update karo
    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data; // { success, message, user }
  } catch (error) {
    return handleNetworkError(error);
  }
}

// ---------- CHANGE PASSWORD ----------
export async function changePassword(currentPassword, newPassword) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/change-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    const data = await response.json();
    return data; // { success, message }
  } catch (error) {
    return handleNetworkError(error);
  }
}