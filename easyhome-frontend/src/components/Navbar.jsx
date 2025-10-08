import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/dashboard">🏠 EasyHome</Link>
      <div className="ms-auto">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
