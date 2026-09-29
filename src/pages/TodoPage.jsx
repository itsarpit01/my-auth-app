import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  fetchTodos,
  addTodo,
  editTodo,
  toggleTodoStatus,
  removeTodo,
} from "../utils/api";
import { taskSchema, searchSchema } from "../utils/todoValidators";
import "../styles/DashboardStyles.css";

function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  const [taskError, setTaskError] = useState("");
  const [editError, setEditError] = useState("");
  const [searchError, setSearchError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);

  const [totalTaskCount, setTotalTaskCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [page, filter, search]);

  async function loadTasks() {
    setIsLoading(true);
    const result = await fetchTodos(page, filter, search, 5);
    setIsLoading(false);

    if (result.success) {
      setTasks(result.todos || []);
      setTotalPages(result.totalPages || 1);
      setTotalTodos(result.totalTodos || 0);

      if (filter === "all" && search === "") {
        setTotalTaskCount(result.totalTodos || 0);
      }
    }
  }

  function handleSearchChange(e) {
    if (totalTaskCount === 0) return;

    const value = e.target.value;
    setSearchError("");

    if (value.trim() === "") {
      setSearch("");
      setPage(1);
      return;
    }

    const result = searchSchema.safeParse({ search: value });
    if (!result.success) {
      setSearchError(result.error.issues[0].message);
      return;
    }

    setSearch(value);
    setPage(1);
  }

  async function handleAddTask(e) {
    e.preventDefault();
    setTaskError("");

    const validation = taskSchema.safeParse({ title: input });
    if (!validation.success) {
      setTaskError(validation.error.issues[0].message);
      return;
    }

    const titleToAdd = validation.data.title;

    const alreadyExists = tasks.some(
      (t) => t.title.trim().toLowerCase() === titleToAdd.toLowerCase()
    );
    if (alreadyExists) {
      setTaskError("This task already exists in your list!");
      return;
    }

    const result = await addTodo(titleToAdd);
    if (result.success) {
      setInput("");
      setTaskError("");
      setTotalTaskCount((prev) => prev + 1);
      if (page === 1) loadTasks();
      else setPage(1);
    } else {
      setTaskError(result.message || "Failed to add task");
    }
  }

  function handleStartEdit(task) {
    setEditingId(task._id);
    setEditInput(task.title);
    setEditError("");
  }

  async function handleSaveEdit(id) {
    setEditError("");

    const validation = taskSchema.safeParse({ title: editInput });
    if (!validation.success) {
      setEditError(validation.error.issues[0].message);
      return;
    }

    const result = await editTodo(id, validation.data.title);
    if (result.success) {
      setEditingId(null);
      setEditError("");
      loadTasks();
    } else {
      setEditError(result.message || "Failed to update task");
    }
  }

  async function handleToggle(id) {
    const result = await toggleTodoStatus(id);
    if (result.success) {
      loadTasks();
    }
  }

  async function handleDelete(id) {
    const result = await removeTodo(id);
    if (result.success) {
      setTotalTaskCount((prev) => Math.max(0, prev - 1));
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadTasks();
      }
    }
  }

  const isSearchDisabled = totalTaskCount === 0;

  return (
    <DashboardLayout>
      <div className="todo-page-wrapper">
        <div className="todo-header">
          <h1>My Tasks</h1>
          <p>Organize, filter, and track your tasks effortlessly.</p>
        </div>

        <div className="todo-actions-bar">
          <div className="input-with-error">
            <input
              type="text"
              className={`search-input ${isSearchDisabled ? "disabled-search" : ""}`}
              placeholder={
                isSearchDisabled
                  ? "Add a task below first to unlock search..."
                  : "Search tasks..."
              }
              value={isSearchDisabled ? "" : search}
              disabled={isSearchDisabled}
              onChange={handleSearchChange}
            />
            {searchError && <p className="field-error">{searchError}</p>}
          </div>

          <div className="add-task-form-wrapper">
            <form onSubmit={handleAddTask} className="add-task-form">
              <input
                type="text"
                placeholder="Add new task (min 3 characters)..."
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  if (taskError) setTaskError("");
                }}
              />
              <button type="submit" className="btn-add">
                + Add
              </button>
            </form>
            {taskError && <p className="field-error">{taskError}</p>}
          </div>
        </div>

        <div className="filter-tabs">
          <button
            className={filter === "all" ? "filter-tab active" : "filter-tab"}
            onClick={() => { setFilter("all"); setPage(1); }}
          >
            All ({totalTodos})
          </button>
          <button
            className={filter === "active" ? "filter-tab active" : "filter-tab"}
            onClick={() => { setFilter("active"); setPage(1); }}
          >
            Active
          </button>
          <button
            className={filter === "completed" ? "filter-tab active" : "filter-tab"}
            onClick={() => { setFilter("completed"); setPage(1); }}
          >
            Completed
          </button>
        </div>

        <div className="table-card">
          <table className="todo-table">
            <thead>
              <tr>
                <th style={{ width: "60px", textAlign: "center" }}>Done</th>
                <th>Task Title</th>
                <th style={{ width: "120px", textAlign: "center" }}>Status</th>
                <th style={{ width: "180px", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="4" className="table-message">
                    Loading your tasks...
                  </td>
                </tr>
              ) : tasks.length === 0 ? (
                <tr>
                  <td colSpan="4" className="table-message">
                    {search !== ""
                      ? `No tasks found matching "${search}".`
                      : "No tasks found. Add your first task above!"}
                  </td>
                </tr>
              ) : (
                tasks.map((task) => (
                  <tr
                    key={task._id}
                    className={task.completed ? "row-completed" : ""}
                  >
                    <td style={{ textAlign: "center" }}>
                      <input
                        type="checkbox"
                        className="table-checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task._id)}
                      />
                    </td>

                    <td>
                      {editingId === task._id ? (
                        <div className="table-edit-box">
                          <input
                            type="text"
                            value={editInput}
                            onChange={(e) => {
                              setEditInput(e.target.value);
                              if (editError) setEditError("");
                            }}
                            autoFocus
                          />
                          {editError && (
                            <span className="field-error">{editError}</span>
                          )}
                        </div>
                      ) : (
                        <span className="table-task-title">{task.title}</span>
                      )}
                    </td>

                    <td style={{ textAlign: "center" }}>
                      <span
                        className={`status-badge ${task.completed ? "badge-completed" : "badge-active"}`}
                      >
                        {task.completed ? "Completed" : "Active"}
                      </span>
                    </td>

                    <td style={{ textAlign: "right" }}>
                      {editingId === task._id ? (
                        <div className="table-action-group">
                          <button
                            onClick={() => handleSaveEdit(task._id)}
                            className="btn-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingId(null);
                              setEditError("");
                            }}
                            className="btn-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="table-action-group">
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="btn-action edit"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(task._id)}
                            className="btn-action delete"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="page-button"
            >
              Previous
            </button>

            <span className="page-indicator">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="page-button"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TodoPage;