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
  Bell,
  UserCircle
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

      {/* ================= Role-based Menu ================= */}
      {(role === "admin" || role === "owner") && (
        <>
          {/* 🏘 Flats */}
          <NavLink to="/dashboard/flats" className={linkClass}>
            <Building2 size={18} className="me-2" />
            Flats
          </NavLink>

          {/* 👥 Tenants */}
          <NavLink to="/dashboard/tenants" className={linkClass}>
            <Users size={18} className="me-2" />
            Tenants
          </NavLink>

          {/* 💰 Rent */}
          <NavLink to="/dashboard/rents" className={linkClass}>
            <DollarSign size={18} className="me-2" />
            Rent / Bills
          </NavLink>

          {/* 📊 Rent Report */}
          <NavLink to="/dashboard/rents/report" className={linkClass}>
            <BarChart size={18} className="me-2" />
            Rent Report
          </NavLink>

          {/* 💵 Expenses */}
          <NavLink to="/dashboard/expenses" className={linkClass}>
            <FileText size={18} className="me-2" />
            Expenses
          </NavLink>

          {/* 🧾 Invoices */}
          <NavLink to="/dashboard/invoices" className={linkClass}>
            <FileText size={18} className="me-2" />
            Invoices
          </NavLink>

          {/* 🔔 Notification */}
          <div className="d-flex align-items-center mb-3">
            <Bell size={18} className="me-2 text-white" />
            <span className="me-2">Notifications</span>
            <NotificationBell />
          </div>

          {/* ⚙️ Profile / Settings */}
          <NavLink to="/dashboard/profile" className={linkClass}>
            <Settings size={18} className="me-2" />
            My Profile
          </NavLink>
            <NavLink to="/dashboard/settings" className={linkClass}>
            <Settings size={18} className="me-2" />
            Settings
          </NavLink>

        </>
      )}

      {/* ================= Tenant Menu ================= */}
      {role === "tenant" && (
        <>
          {/* 🏠 Tenant Dashboard */}
          <NavLink to="/dashboard/tenant" className={linkClass}>
            <Home size={18} className="me-2" />
            My Dashboard
          </NavLink>

          {/* 👤 My Profile */}
          <NavLink to="/dashboard/profile" className={linkClass}>
            <UserCircle size={18} className="me-2" />
            My Profile
          </NavLink>
          <NavLink to="/dashboard/settings" className={linkClass}>
            <Settings size={18} className="me-2" />
            Settings
          </NavLink>
        </>
      )}

      <hr className="text-secondary mt-4" />

      {/* ================= Logout Button ================= */}
      <button
        onClick={handleLogout}
        className="btn btn-danger mt-auto d-flex align-items-center justify-content-center"
      >
        <LogOut size={18} className="me-2" />
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
