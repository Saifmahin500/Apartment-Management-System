import React, { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../../api/settingsApi";
import Swal from "sweetalert2";

const SettingsPage = () => {
  const [form, setForm] = useState({
    language: "en",
    notification_enabled: true,
    timezone: "Asia/Dhaka",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSettings()
      .then((res) => {
        setForm(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        Swal.fire("Error", "Failed to load settings.", "error");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(form);
      Swal.fire("Success!", "Settings updated successfully!", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to update settings.", "error");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading settings...</p>;

  return (
    <div className="max-w-lg mx-auto bg-white p-6 shadow-md rounded-2xl">
      <h2 className="text-2xl font-semibold mb-5 text-center">
        ⚙️ User Settings
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language Selection */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Language
          </label>
          <select
            name="language"
            value={form.language}
            onChange={handleChange}
            className="border w-full p-2 rounded"
          >
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </div>

        {/* Timezone */}
        <div>
          <label className="block text-gray-700 mb-1 font-medium">
            Timezone
          </label>
          <input
            type="text"
            name="timezone"
            value={form.timezone}
            onChange={handleChange}
            placeholder="e.g. Asia/Dhaka"
            className="border w-full p-2 rounded"
          />
        </div>

        {/* Notification Switch */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="notification_enabled"
            checked={form.notification_enabled}
            onChange={handleChange}
            id="notif"
            className="h-5 w-5"
          />
          <label htmlFor="notif" className="text-gray-700 font-medium">
            Enable Notifications
          </label>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        >
          Save Settings
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
