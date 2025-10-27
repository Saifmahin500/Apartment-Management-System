import React, { useState, useEffect } from "react";
import { getProfile, updateProfile } from "../../api/profileApi.js";

const ProfileEdit = ({ onBack }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    about: "",
    language: "en",
    timezone: "Asia/Dhaka",
    profile_photo: null,
  });

  const [preview, setPreview] = useState(null);

  useEffect(() => {
    getProfile().then((res) => setForm(res.data.data));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile_photo" && files[0]) {
      setForm({ ...form, profile_photo: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      await updateProfile(formData);
      alert("Profile updated successfully!");
      onBack();
    } catch (err) {
      alert("Error updating profile.");
    }
  };

  return (
    <>
      <style>{`
        .edit-card {
          max-width: 650px;
          margin: 0 auto;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(19, 50, 50, 0.15);
          overflow: hidden;
        }
        .edit-header {
          background: linear-gradient(135deg, #133232 0%, #1C8A96 100%);
          padding: 1.5rem;
          color: white;
        }
        .edit-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }
        .form-label-custom {
          color: #133232;
          font-weight: 600;
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }
        .form-control-custom {
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          padding: 0.625rem 1rem;
          font-size: 0.95rem;
          transition: all 0.3s;
        }
        .form-control-custom:focus {
          border-color: #1C8A96;
          box-shadow: 0 0 0 0.2rem rgba(28, 138, 150, 0.15);
          outline: none;
        }
        .form-control-custom::placeholder {
          color: #a0a0a0;
        }
        .photo-upload-area {
          border: 2px dashed #1C8A96;
          border-radius: 12px;
          padding: 1.5rem;
          background: #f8feff;
          text-align: center;
          transition: all 0.3s;
        }
        .photo-upload-area:hover {
          background: #e8f7f9;
          border-color: #133232;
        }
        .preview-avatar {
          width: 100px;
          height: 100px;
          border: 4px solid #1C8A96;
          box-shadow: 0 4px 12px rgba(28, 138, 150, 0.2);
        }
        .btn-save {
          background-color: #1C8A96;
          border: none;
          color: white;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-save:hover {
          background-color: #133232;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(28, 138, 150, 0.3);
        }
        .btn-cancel {
          background-color: white;
          border: 2px solid #6c757d;
          color: #6c757d;
          padding: 0.75rem 2rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-cancel:hover {
          background-color: #6c757d;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
        }
        .file-input-wrapper {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }
        .file-input-custom {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
        .file-input-label {
          background-color: #1C8A96;
          color: white;
          padding: 0.5rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }
        .file-input-label:hover {
          background-color: #133232;
        }
      `}</style>

      <div className="edit-card">
        {/* Header */}
        <div className="edit-header">
          <h2 className="edit-title">✏️ Edit Profile</h2>
          <p className="mb-0 mt-1" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
            Update your personal information
          </p>
        </div>

        {/* Form Body */}
        <div className="p-4">
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label-custom">👤 Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name || ""}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="form-control form-control-custom"
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label-custom">📞 Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone || ""}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="form-control form-control-custom"
              />
            </div>

            {/* Address */}
            <div className="mb-3">
              <label className="form-label-custom">📍 Address</label>
              <input
                type="text"
                name="address"
                value={form.address || ""}
                onChange={handleChange}
                placeholder="Enter your address"
                className="form-control form-control-custom"
              />
            </div>

            {/* About */}
            <div className="mb-3">
              <label className="form-label-custom">📝 About</label>
              <textarea
                name="about"
                value={form.about || ""}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                className="form-control form-control-custom"
                rows="3"
              />
            </div>

            {/* Language & Timezone Row */}
            <div className="row mb-3">
              <div className="col-md-6 mb-3 mb-md-0">
                <label className="form-label-custom">🌐 Language</label>
                <select
                  name="language"
                  value={form.language || "en"}
                  onChange={handleChange}
                  className="form-select form-control-custom"
                >
                  <option value="en">English</option>
                  <option value="bn">বাংলা</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label-custom">🕒 Timezone</label>
                <input
                  type="text"
                  name="timezone"
                  value={form.timezone || ""}
                  onChange={handleChange}
                  placeholder="e.g. Asia/Dhaka"
                  className="form-control form-control-custom"
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div className="mb-4">
              <label className="form-label-custom">📸 Profile Photo</label>
              <div className="photo-upload-area">
                <div className="d-flex align-items-center justify-content-center gap-3 flex-wrap">
                  {preview && (
                    <img
                      src={preview}
                      alt="Preview"
                      className="rounded-circle preview-avatar object-fit-cover"
                    />
                  )}
                  <div className="file-input-wrapper">
                    <input
                      type="file"
                      name="profile_photo"
                      accept="image/*"
                      onChange={handleChange}
                      className="file-input-custom"
                      id="fileInput"
                    />
                    <label htmlFor="fileInput" className="file-input-label mb-0">
                      📁 Choose Photo
                    </label>
                  </div>
                </div>
                <p className="text-muted mt-2 mb-0" style={{ fontSize: '0.85rem' }}>
                  Supported: JPG, PNG (Max 2MB)
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="d-flex justify-content-between gap-3 pt-3 border-top">
              <button
                type="button"
                onClick={onBack}
                className="btn btn-cancel"
              >
                ← Cancel
              </button>
              <button
                type="submit"
                className="btn btn-save"
              >
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfileEdit;