import React, { useEffect, useState } from "react";
import api from "../../services/api";

const DashboardHome = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      <h2 className="fw-bold">Dashboard</h2>
      <p className="text-muted">Welcome to EasyHome management panel 🚀</p>
      {user && (
        <div className="card p-3 shadow-sm mt-3">
          <h5>Hello, {user.name}</h5>
          <p className="mb-0">{user.email}</p>
        </div>
      )}
    </div>
  );
};

export default DashboardHome;
