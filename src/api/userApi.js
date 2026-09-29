import { apiRequest } from "./apiClient";

export async function fetchProfile() {
  return apiRequest("/auth/profile");
}

export async function updateProfile(name, email) {
  const data = await apiRequest("/auth/update-profile", {
    method: "PUT",
    body: JSON.stringify({ name, email }),
  });

  if (data.success) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
}

export async function changePassword(currentPassword, newPassword) {
  return apiRequest("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
}

export async function deleteAccount(password) {
  const data = await apiRequest("/auth/delete-account", {
    method: "DELETE",
    body: JSON.stringify({ password }),
  });

  if (data.success) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  return data;
}