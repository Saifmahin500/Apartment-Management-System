import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

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

  return (
    <>
      <Navbar />
      <div className="container mt-5 text-center">
        <h2>Dashboard</h2>
        {user ? <p>Welcome, <b>{user.name}</b> 👋</p> : <p>Loading user info...</p>}
      </div>
    </>
  );
};

export default Dashboard;
