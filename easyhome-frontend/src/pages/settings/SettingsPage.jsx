import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { toast } from "react-toastify";

const SettingsPage = () => {
  const [form, setForm] = useState({
    site_name: "",
    email: "",
    phone: "",
    address: "",
    currency: "BDT",
    payment_method: "manual",
    site_logo: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Load current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get("/settings");
        setForm(res.data);
        if (res.data.site_logo) {
          setPreview(res.data.site_logo_url || `/storage/${res.data.site_logo}`);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load settings");
      }
    };
    fetchSettings();
  }, []);

  // 🔹 Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 🔹 Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, site_logo: file });
    setPreview(URL.createObjectURL(file));
  };

  // 🔹 Submit updated settings
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) formData.append(key, value);
      });

      const res = await api.post("/settings/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Settings updated successfully!");
      setForm(res.data.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">System Settings ⚙️</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Site Name */}
        <div className="mb-3">
          <label className="form-label">Site Name</label>
          <input
            type="text"
            className="form-control"
            name="site_name"
            value={form.site_name || ""}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
          />
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            type="text"
            className="form-control"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="mb-3">
          <label className="form-label">Address</label>
          <textarea
            className="form-control"
            name="address"
            rows="3"
            value={form.address || ""}
            onChange={handleChange}
          ></textarea>
        </div>

        {/* Currency */}
        <div className="mb-3">
          <label className="form-label">Currency</label>
          <input
            type="text"
            className="form-control"
            name="currency"
            value={form.currency || ""}
            onChange={handleChange}
          />
        </div>

        {/* Payment Method */}
        <div className="mb-3">
          <label className="form-label">Payment Method</label>
          <select
            className="form-select"
            name="payment_method"
            value={form.payment_method || ""}
            onChange={handleChange}
          >
            <option value="manual">Manual</option>
            <option value="online">Online</option>
          </select>
        </div>

        {/* Logo Upload */}
        <div className="mb-3">
          <label className="form-label">Site Logo</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
          {preview && (
            <div className="mt-3">
              <img
                src={preview}
                alt="Logo Preview"
                width="120"
                className="rounded border"
              />
            </div>
          )}
        </div>

        {/* Save Button */}
        <button
          type="submit"
          className="btn btn-primary mt-2"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
