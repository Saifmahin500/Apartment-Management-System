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
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-2xl">
      <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={form.name || ""}
          onChange={handleChange}
          placeholder="Full Name"
          className="border w-full p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          value={form.phone || ""}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border w-full p-2 rounded"
        />
        <input
          type="text"
          name="address"
          value={form.address || ""}
          onChange={handleChange}
          placeholder="Address"
          className="border w-full p-2 rounded"
        />
        <textarea
          name="about"
          value={form.about || ""}
          onChange={handleChange}
          placeholder="About"
          className="border w-full p-2 rounded"
        />
        <select
          name="language"
          value={form.language || "en"}
          onChange={handleChange}
          className="border w-full p-2 rounded"
        >
          <option value="en">English</option>
          <option value="bn">বাংলা</option>
        </select>
        <input
          type="text"
          name="timezone"
          value={form.timezone || ""}
          onChange={handleChange}
          placeholder="Timezone"
          className="border w-full p-2 rounded"
        />

        <div className="flex items-center gap-3">
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <input
            type="file"
            name="profile_photo"
            accept="image/*"
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
