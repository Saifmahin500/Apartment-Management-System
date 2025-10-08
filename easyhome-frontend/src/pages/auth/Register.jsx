import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "../../components/AuthLayout";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "",phone:"", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);


      Swal.fire({
        title: "🎉 Registration Successful!",
        text: "Welcome to EasyHome, " + res.data.user.name + "!",
        icon: "success",
        confirmButtonColor: "#28a745",
      }).then(() => navigate("/dashboard"));
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong!";
      setError(message);
      Swal.fire({
        title: "❌ Error",
        text: message,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <AuthLayout title="Create Your Account ✨">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Full Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter name"
            required
          />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter email"
            required
          />
        </div>
        <div className="mb-3">
  <label>Phone</label>
  <input
    name="phone"
    value={form.phone}
    onChange={handleChange}
    className="form-control"
    placeholder="Enter phone number"
    required
  />
</div>

        <div className="mb-3">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Create password"
            required
          />
        </div>
        <button className="btn btn-success w-100">Register</button>
      </form>
      <p className="text-center mt-3">
        Already have an account?{" "}
        <span
          style={{ color: "#007bff", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          Login
        </span>
      </p>
    </AuthLayout>
  );
};

export default Register;
