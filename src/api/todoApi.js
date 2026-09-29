import { apiRequest } from "./apiClient";

export async function fetchTodos(
  page = 1,
  filter = "all",
  search = "",
  limit = 5
) {
  const params = new URLSearchParams({
    page,
    filter,
    search,
    limit,
  });

  return apiRequest(`/todos?${params.toString()}`);
}

export async function addTodo(title) {
  return apiRequest("/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export async function editTodo(id, title) {
  return apiRequest(`/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify({ title }),
  });
}

export async function toggleTodoStatus(id) {
  return apiRequest(`/todos/${id}/toggle`, {
    method: "PATCH",
  });
}

export async function removeTodo(id) {
  return apiRequest(`/todos/${id}`, {
    method: "DELETE",
  });
}