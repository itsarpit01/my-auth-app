import { useState, useEffect } from "react";
import { fetchTodos, addTodo, editTodo, toggleTodoStatus, removeTodo } from "../api/todoApi";
import { taskSchema, searchSchema } from "../utils/todoValidators";
import { useDebounce } from "../hooks/useDebounce";
import AddTaskModal from "../components/AddTaskModal";
import ConfirmModal from "../components/ConfirmModal";
import "../styles/DashboardStyles.css";

function TodoPage() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [searchInput, setSearchInput] = useState("");
  const debouncedSearch = useDebounce(searchInput, 400);

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
  }, [page, filter, debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  async function loadTasks() {
    setIsLoading(true);
    const result = await fetchTodos(page, filter, debouncedSearch, 5);
    setIsLoading(false);

    if (result.success) {
      setTasks(result.todos || []);
      setTotalPages(result.totalPages || 1);
      setTotalTodos(result.totalTodos || 0);

      if (filter === "all" && debouncedSearch === "") {
        setTotalTaskCount(result.totalTodos || 0);
      }
    }
  }

  function handleSearchChange(e) {
    if (totalTaskCount === 0) return;

    const value = e.target.value;
    setSearchError("");
    setSearchInput(value);

    if (value.trim() === "") return;

    const result = searchSchema.safeParse({ search: value });
    if (!result.success) {
      setSearchError(result.error.issues[0].message);
    }
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

    setIsAdding(true);
    const result = await addTodo(titleToAdd);
    setIsAdding(false);

    if (result.success) {
      setInput("");
      setTaskError("");
      setShowAddModal(false);
      setTotalTaskCount((prev) => prev + 1);
      if (page === 1) loadTasks();
      else setPage(1);
    } else {
      setTaskError(result.message || "Failed to add task");
    }
  }

  function handleOpenAddModal() {
    setInput("");
    setTaskError("");
    setShowAddModal(true);
  }

  function handleCloseAddModal() {
    setShowAddModal(false);
    setInput("");
    setTaskError("");
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

  function handleDeleteClick(id) {
    setDeleteTargetId(id);
  }

  async function handleConfirmDelete() {
    const id = deleteTargetId;
    setDeleteTargetId(null);

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
            value={isSearchDisabled ? "" : searchInput}
            disabled={isSearchDisabled}
            onChange={handleSearchChange}
          />
          {searchError && <p className="field-error">{searchError}</p>}
        </div>

        <div className="add-task-form-wrapper">
          <button onClick={handleOpenAddModal} className="btn-add">
            + Add Task
          </button>
        </div>
      </div>

      <div className="filter-tabs">
        <button
          className={filter === "all" ? "filter-tab active" : "filter-tab"}
          onClick={() => { setFilter("all"); setPage(1); }}
        >
          All
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
                  {debouncedSearch !== ""
                    ? `No tasks found matching "${debouncedSearch}".`
                    : "No tasks found. Add your first task above!"}
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr key={task._id} className={task.completed ? "row-completed" : ""}>
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
                        {editError && <span className="field-error">{editError}</span>}
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
                        <button onClick={() => handleSaveEdit(task._id)} className="btn-save">
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
                        <button onClick={() => handleStartEdit(task)} className="btn-action edit">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteClick(task._id)} className="btn-action delete">
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

      {showAddModal && (
        <AddTaskModal
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            if (taskError) setTaskError("");
          }}
          error={taskError}
          onSubmit={handleAddTask}
          onCancel={handleCloseAddModal}
          isLoading={isAdding}
        />
      )}

      {deleteTargetId && (
        <ConfirmModal
          title="Delete Task?"
          message="Are you sure you want to delete this task? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={() => setDeleteTargetId(null)}
        />
      )}
    </div>
  );
}

export default TodoPage;