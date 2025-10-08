import React, { useEffect, useState } from "react";
import api from "../../services/api";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-3">👤 Profile</h3>
      {user ? (
        <div className="card p-3 shadow-sm">
          <p><b>Name:</b> {user.name}</p>
          <p><b>Email:</b> {user.email}</p>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}
    </div>
  );
};

export default Profile;
