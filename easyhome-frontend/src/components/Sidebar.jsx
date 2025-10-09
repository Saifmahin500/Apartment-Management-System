import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  FileText,
  Settings,
  LogOut,
  Home,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{ minHeight: "100vh", width: "240px" }}
    >
      <h4 className="text-center mb-4">🏢 EasyHome</h4>

      {/* Common Links */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `text-decoration-none d-flex align-items-center mb-3 ${
            isActive ? "fw-bold text-warning" : "text-white"
          }`
        }
      >
        <LayoutDashboard size={18} className="me-2" />
        Dashboard
      </NavLink>

      {/* ADMIN / OWNER Links */}
      {(role === "admin" || role === "owner") && (
        <>
          <NavLink
            to="/dashboard/tenants"
            className={({ isActive }) =>
              `text-decoration-none d-flex align-items-center mb-3 ${
                isActive ? "fw-bold text-warning" : "text-white"
              }`
            }
          >
            <Users size={18} className="me-2" />
            Tenants
          </NavLink>

          <NavLink
            to="/dashboard/rents"
            className={({ isActive }) =>
              `text-decoration-none d-flex align-items-center mb-3 ${
                isActive ? "fw-bold text-warning" : "text-white"
              }`
            }
          >
            <DollarSign size={18} className="me-2" />
            Rent / Bills
          </NavLink>

          <NavLink
            to="/dashboard/expenses"
            className={({ isActive }) =>
              `text-decoration-none d-flex align-items-center mb-3 ${
                isActive ? "fw-bold text-warning" : "text-white"
              }`
            }
          >
            <FileText size={18} className="me-2" />
            Expenses
          </NavLink>

          <NavLink
            to="/dashboard/invoices"
            className={({ isActive }) =>
              `text-decoration-none d-flex align-items-center mb-3 ${
                isActive ? "fw-bold text-warning" : "text-white"
              }`
            }
          >
            <FileText size={18} className="me-2" />
            Invoices
          </NavLink>
        </>
      )}

      {/* TENANT Links */}
      {role === "tenant" && (
        <>
          <NavLink
            to="/dashboard/tenant"
            className={({ isActive }) =>
              `text-decoration-none d-flex align-items-center mb-3 ${
                isActive ? "fw-bold text-warning" : "text-white"
              }`
            }
          >
            <Home size={18} className="me-2" />
            My Dashboard
          </NavLink>

          <NavLink
            to="/dashboard/profile"
            className={({ isActive }) =>
              `text-decoration-none d-flex align-items-center mb-3 ${
                isActive ? "fw-bold text-warning" : "text-white"
              }`
            }
          >
            <Settings size={18} className="me-2" />
            My Profile
          </NavLink>
        </>
      )}

      <hr className="text-secondary" />

      {/* Logout */}
      <button onClick={handleLogout} className="btn btn-danger mt-auto">
        <LogOut size={18} className="me-2" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
