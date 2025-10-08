import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        alert("Please login first!");
        navigate("/");
      });
  }, []);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="container mt-5 text-center">
      <h2>Dashboard</h2>
      {user && <p>Welcome, {user.name}!</p>}
      <button onClick={handleLogout} className="btn btn-danger mt-3">Logout</button>
    </div>
  );
};

export default Dashboard;
