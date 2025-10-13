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
  BarChart,
  Building2,
  Bell
} from "lucide-react";
import NotificationBell from "../components/NotificationBell";

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `text-decoration-none d-flex align-items-center mb-3 ${
      isActive ? "fw-bold text-warning" : "text-white"
    }`;

  return (
    <div
      className="d-flex flex-column bg-dark text-white p-3"
      style={{ minHeight: "100vh", width: "240px" }}
    >
      {/* ================= Header ================= */}
      <h4 className="text-center mb-4">🏢 EasyHome</h4>

      {/* ================= Common Links ================= */}
      <NavLink to="/dashboard" className={linkClass}>
        <LayoutDashboard size={18} className="me-2" />
        Dashboard
      </NavLink>

      {/* ================= Admin / Owner Links ================= */}
      {(role === "admin" || role === "owner") && (
        <>
          <NavLink to="/dashboard/flats" className={linkClass}>
            <Building2 size={18} className="me-2" />
            Flats
          </NavLink>

          <NavLink to="/dashboard/tenants" className={linkClass}>
            <Users size={18} className="me-2" />
            Tenants
          </NavLink>

          <NavLink to="/dashboard/rents" className={linkClass}>
            <DollarSign size={18} className="me-2" />
            Rent / Bills
          </NavLink>

          <NavLink to="/dashboard/rents/report" className={linkClass}>
            <BarChart size={18} className="me-2" />
            Rent Report
          </NavLink>

          <NavLink to="/dashboard/expenses" className={linkClass}>
            <FileText size={18} className="me-2" />
            Expenses
          </NavLink>

          <NavLink to="/dashboard/invoices" className={linkClass}>
            <FileText size={18} className="me-2" />
            Invoices
          </NavLink>

          {/* 🔔 Notification Menu Item */}
          <div className="d-flex align-items-center mb-3">
            <Bell size={18} className="me-2 text-white" />
            <span className="me-2">Notification</span>
            <NotificationBell />
          </div>
        </>
      )}

      {/* ================= Tenant Links ================= */}
      {role === "tenant" && (
        <>
          <NavLink to="/dashboard/tenant" className={linkClass}>
            <Home size={18} className="me-2" />
            My Dashboard
          </NavLink>

          <NavLink to="/dashboard/profile" className={linkClass}>
            <Settings size={18} className="me-2" />
            My Profile
          </NavLink>
        </>
      )}

      <hr className="text-secondary" />

      {/* ================= Logout Button ================= */}
      <button onClick={handleLogout} className="btn btn-danger mt-auto">
        <LogOut size={18} className="me-2" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
