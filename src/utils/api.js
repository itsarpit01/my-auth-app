
const API_URL = "http://localhost:5000/api/auth";

function handleNetworkError(error) {
  console.error("Network error:", error);
  return {
    success: false,
    message: "Unable to connect to server. Please check your internet connection or try again later.",
  };
}

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
    return data;
  } catch (error) {
    return handleNetworkError(error);
  }
}

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

    
    if (data.success) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data; 
  } catch (error) {
    return handleNetworkError(error);
  }
}

export function isUserLoggedIn() {
  return !!localStorage.getItem("token");
}

export function getCurrentUser() {
  const userData = localStorage.getItem("user");
  return userData ? JSON.parse(userData) : null;
}

export function logoutUser() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

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
    return data; 
  } catch (error) {
    return handleNetworkError(error);
  }
}

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

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }

    return data; 
  } catch (error) {
    return handleNetworkError(error);
  }
}

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
    return data; 
  } catch (error) {
    return handleNetworkError(error);
  }
}
const TODO_API = "http://localhost:5000/api/todos";

export async function fetchTodos(page = 1, filter = "all", search = "", limit = 5) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `${TODO_API}?page=${page}&filter=${filter}&search=${encodeURIComponent(search)}&limit=${limit}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
}

export async function addTodo(title) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(TODO_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
}


export async function editTodo(id, title) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${TODO_API}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
}


export async function toggleTodoStatus(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${TODO_API}/${id}/toggle`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
}


export async function removeTodo(id) {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${TODO_API}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    return await response.json();
  } catch (error) {
    return handleNetworkError(error);
  }
}

export async function deleteAccount(password) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/delete-account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();

    if (data.success) {
      logoutUser(); 
    }

    return data;
  } catch (error) {
    return handleNetworkError(error);
  }
}