const BASE_URL = "http://localhost:5000/api";

export function getToken() {
  return localStorage.getItem("token");
}

export async function apiRequest(endpoint, options = {}) {
  try {
    const token = getToken();

    const headers = {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    return await response.json();
  } catch (error) {
    console.error("Network error:", error);

    return {
      success: false,
      message:
        "Unable to connect to server. Please check your internet connection or try again later.",
    };
  }
}