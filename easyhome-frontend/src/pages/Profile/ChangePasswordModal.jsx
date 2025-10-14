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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-xl w-96 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4 text-center">
          Change Password
        </h2>

        {error && (
          <div className="bg-red-100 text-red-600 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            name="current_password"
            placeholder="Current Password"
            value={form.current_password}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />

          <input
            type="password"
            name="new_password"
            placeholder="New Password"
            value={form.new_password}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />

          <input
            type="password"
            name="new_password_confirmation"
            placeholder="Confirm New Password"
            value={form.new_password_confirmation}
            onChange={handleChange}
            className="border w-full p-2 rounded"
            required
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {loading ? "Saving..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
