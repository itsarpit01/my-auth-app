function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn-theme-secondary">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn-danger">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;