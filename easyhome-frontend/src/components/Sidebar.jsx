import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{ height: "100vh", width: "230px" }}
    >
      <h4 className="text-center mb-4">🏢 EasyHome</h4>

      {/* Dashboard */}
      <Link to="/dashboard" className="text-white mb-2 text-decoration-none">
        🏠 Dashboard
      </Link>

      {/* Profile */}
      <Link to="/dashboard/profile" className="text-white mb-2 text-decoration-none">
        👤 Profile
      </Link>

      {/* Tenants */}
      <Link to="/dashboard/tenants" className="text-white mb-2 text-decoration-none">
        👥 Tenants
      </Link>

      {/* Rents / Bills */}
      <Link to="/dashboard/rents" className="text-white mb-2 text-decoration-none">
        💵 Rent / Bills
      </Link>

      {/* Expenses */}
      <Link to="/dashboard/expenses" className="text-white mb-2 text-decoration-none">
        🧾 Expenses
      </Link>

      {/* Invoices */}
      <Link to="/dashboard/invoices" className="text-white mb-2 text-decoration-none">
        📑 Invoices
      </Link>

      <hr />

      {/* Logout */}
      <button onClick={handleLogout} className="btn btn-danger mt-auto">
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;
