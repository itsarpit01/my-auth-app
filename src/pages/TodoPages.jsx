import { useState, useEffect } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import {
  fetchTodos,
  addTodo,
  editTodo,
  toggleTodoStatus,
  removeTodo,
} from "../utils/api";
import "../styles/DashboardStyles.css";

function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Search & Filters
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // "all" | "active" | "completed"

  // Inline Edit states
  const [editingId, setEditingId] = useState(null);
  const [editInput, setEditInput] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  // Load tasks on page, filter, or search change
  useEffect(() => {
    loadTasks();
  }, [page, filter, search]);

  async function loadTasks() {
    setIsLoading(true);
    const result = await fetchTodos(page, filter, search, 5);
    setIsLoading(false);

    if (result.success) {
      setTasks(result.todos);
      setTotalPages(result.totalPages);
      setTotalTodos(result.totalTodos);
    }
  }

  // 1. Add Task
  async function handleAddTask(e) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    const result = await addTodo(trimmed);
    if (result.success) {
      setInput("");
      if (page === 1) loadTasks();
      else setPage(1);
    }
  }

  // 2. Start Edit
  function handleStartEdit(task) {
    setEditingId(task._id);
    setEditInput(task.title);
  }

  // 3. Save Edit
  async function handleSaveEdit(id) {
    const trimmed = editInput.trim();
    if (!trimmed) return;

    const result = await editTodo(id, trimmed);
    if (result.success) {
      setEditingId(null);
      loadTasks();
    }
  }

  // 4. Toggle Task Complete
  async function handleToggle(id) {
    const result = await toggleTodoStatus(id);
    if (result.success) {
      loadTasks();
    }
  }

  // 5. Delete Task
  async function handleDelete(id) {
    const result = await removeTodo(id);
    if (result.success) {
      if (tasks.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadTasks();
      }
    }
  }

  return (
    <DashboardLayout>
      <div className="todo-page-wrapper">
        <div className="todo-header">
          <h1>My Tasks</h1>
          <p>Organize, filter, and track your tasks effortlessly.</p>
        </div>

        {/* SEARCH & ADD BAR */}
        <div className="todo-actions-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search tasks..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />

          <form onSubmit={handleAddTask} className="add-task-form">
            <input
              type="text"
              placeholder="Add new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className="btn-add">
              + Add
            </button>
          </form>
        </div>

        {/* FILTER TABS */}
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

        {/* TASK LIST */}
        <div className="task-list">
          {isLoading ? (
            <p className="state-message">Loading your tasks...</p>
          ) : tasks.length === 0 ? (
            <p className="state-message">No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task._id}
                className={`task-row ${task.completed ? "task-done" : ""}`}
              >
                {/* CHECKBOX & TITLE / EDIT INPUT */}
                {editingId === task._id ? (
                  <div className="inline-edit-box">
                    <input
                      type="text"
                      value={editInput}
                      onChange={(e) => setEditInput(e.target.value)}
                      autoFocus
                    />
                    <button onClick={() => handleSaveEdit(task._id)} className="btn-save">
                      Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-cancel">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="task-content">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => handleToggle(task._id)}
                      />
                      <span className="task-text">{task.title}</span>
                    </label>

                    <div className="task-buttons">
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="btn-action edit"
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="btn-action delete"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="pagination-bar">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="page-button"
            >
              ← Previous
            </button>

            <span className="page-indicator">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="page-button"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default TodoPage;