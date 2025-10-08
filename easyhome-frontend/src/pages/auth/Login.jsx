import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AuthLayout from "../../components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      Swal.fire({
        title: "✅ Login Successful!",
        text: "Welcome back, " + res.data.user.name + "!",
        icon: "success",
        confirmButtonColor: "#0d6efd",
      }).then(() => navigate("/dashboard"));
    } catch (err) {
      const message = err.response?.data?.message || "Invalid credentials!";
      setError(message);
      Swal.fire({
        title: "❌ Login Failed",
        text: message,
        icon: "error",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  return (
    <AuthLayout title="Welcome Back 👋">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
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
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="form-control"
            placeholder="Enter password"
            required
          />
        </div>
        <button className="btn btn-primary w-100">Login</button>
      </form>
      <p className="text-center mt-3">
        Don’t have an account?{" "}
        <span
          style={{ color: "#007bff", cursor: "pointer" }}
          onClick={() => navigate("/register")}
        >
          Register
        </span>
      </p>
    </AuthLayout>
  );
};

export default Login;
