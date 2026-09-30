function AddTaskModal({ value, onChange, error, onSubmit, onCancel, isLoading }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add New Task</h3>

        <form onSubmit={onSubmit}>
          <div className="settings-form-group">
            <input
              type="text"
              placeholder="Enter task (min 3 characters)..."
              value={value}
              onChange={onChange}
              autoFocus
            />
            {error && <p className="field-error">{error}</p>}
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn-theme-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-theme-primary" disabled={isLoading}>
              {isLoading ? "Adding..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;