import React, { useState } from "react";
import { changePassword } from "../../api/profileApi";

const ChangePasswordModal = ({ onClose }) => {
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (form.new_password !== form.new_password_confirmation) {
      setError("New password and confirmation do not match!");
      setLoading(false);
      return;
    }

    try {
      await changePassword(form);
      alert("Password updated successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      setError("Invalid current password or server error.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          animation: fadeIn 0.2s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .modal-content-custom {
          background: white;
          border-radius: 16px;
          width: 450px;
          max-width: 95%;
          box-shadow: 0 10px 40px rgba(19, 50, 50, 0.3);
          animation: slideUp 0.3s ease;
          overflow: hidden;
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .modal-header-custom {
          background: linear-gradient(135deg, #133232 0%, #1C8A96 100%);
          padding: 1.5rem;
          color: white;
          position: relative;
        }
        .modal-title-custom {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          text-align: center;
        }
        .close-btn {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 1.2rem;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: rotate(90deg);
        }
        .modal-body-custom {
          padding: 2rem;
        }
        .error-alert {
          background-color: #fee;
          border-left: 4px solid #dc3545;
          color: #721c24;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.9rem;
          margin-bottom: 1.5rem;
          animation: shake 0.4s;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .form-label-modal {
          color: #133232;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .form-control-modal {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s;
          width: 100%;
        }
        .form-control-modal:focus {
          border-color: #1C8A96;
          box-shadow: 0 0 0 0.2rem rgba(28, 138, 150, 0.15);
          outline: none;
        }
        .form-control-modal::placeholder {
          color: #a0a0a0;
        }
        .btn-update {
          background-color: #1C8A96;
          border: none;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
          width: 100%;
        }
        .btn-update:hover:not(:disabled) {
          background-color: #133232;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(28, 138, 150, 0.3);
        }
        .btn-update:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-cancel-modal {
          background-color: white;
          border: 2px solid #6c757d;
          color: #6c757d;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
          width: 100%;
        }
        .btn-cancel-modal:hover {
          background-color: #6c757d;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }
        .input-icon {
          font-size: 0.85rem;
          margin-right: 0.25rem;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content-custom" onClick={(e) => e.stopPropagation()}>
          {/* Modal Header */}
          <div className="modal-header-custom">
            <h2 className="modal-title-custom">🔒 Change Password</h2>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>

          {/* Modal Body */}
          <div className="modal-body-custom">
            {error && (
              <div className="error-alert">
                <strong>⚠️ Error:</strong> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Current Password */}
              <div className="mb-3">
                <label className="form-label-modal">
                  <span className="input-icon">🔑</span>
                  Current Password
                </label>
                <input
                  type="password"
                  name="current_password"
                  placeholder="Enter current password"
                  value={form.current_password}
                  onChange={handleChange}
                  className="form-control-modal"
                  required
                />
              </div>

              {/* New Password */}
              <div className="mb-3">
                <label className="form-label-modal">
                  <span className="input-icon">🔐</span>
                  New Password
                </label>
                <input
                  type="password"
                  name="new_password"
                  placeholder="Enter new password"
                  value={form.new_password}
                  onChange={handleChange}
                  className="form-control-modal"
                  required
                />
              </div>

              {/* Confirm New Password */}
              <div className="mb-4">
                <label className="form-label-modal">
                  <span className="input-icon">✓</span>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="new_password_confirmation"
                  placeholder="Re-enter new password"
                  value={form.new_password_confirmation}
                  onChange={handleChange}
                  className="form-control-modal"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="row g-3">
                <div className="col-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-cancel-modal"
                  >
                    Cancel
                  </button>
                </div>
                <div className="col-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-update"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Password"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordModal;