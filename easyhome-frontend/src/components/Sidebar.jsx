import React, { useState } from "react";
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
  UserCircle,
  Menu,
  X
} from "lucide-react";
import NotificationBell from "../components/NotificationBell";
import "../app.css"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    `sidebar-link text-decoration-none d-flex align-items-center px-3 py-2 mb-2 rounded-2 transition ${
      isActive
        ? "bg-warning text-dark fw-semibold"
        : "text-white-50"
    }`;

  return (
    <>
      {/* === Mobile Toggle Button === */}
      <button
        className="btn btn-light d-md-none position-fixed"
        style={{ top: "15px", left: "15px", zIndex: 1100 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* === Overlay for mobile === */}
      {isOpen && (
        <div
          className="d-md-none sidebar-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* === Sidebar Container === */}
      <div
        className={`d-flex flex-column p-4 sidebar-container ${
          isOpen && window.innerWidth < 768 ? "open" : ""
        }`}
      >
        {/* === Brand Header === */}
        <div className="sidebar-header">
          <div style={{ fontSize: "24px", marginBottom: "6px" }}>🏢</div>
          <span>EasyHome</span>
        </div>

        {/* === Common Links === */}
        

        {/* === Role-based Menus === */}
        {(role === "admin" || role === "owner") && (
          <>

          <div className="sidebar-section">
                    <NavLink
                      to="/dashboard"
                      className={linkClass}
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard size={18} className="me-2" />
                      <span>Dashboard</span>
                    </NavLink>
                  </div>
            {/* Properties */}
            <div className="sidebar-section-title">📦 Properties</div>
            <div className="sidebar-section">
              <NavLink
                to="/dashboard/flats"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <Building2 size={18} className="me-2" />
                <span>Flats</span>
              </NavLink>

              <NavLink
                to="/dashboard/tenants"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <Users size={18} className="me-2" />
                <span>Tenants</span>
              </NavLink>
            </div>

            {/* Finance */}
            <div className="sidebar-section-title">💰 Finance</div>
            <div className="sidebar-section">
              <NavLink
                to="/dashboard/rents"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <DollarSign size={18} className="me-2" />
                <span>Rent / Bills</span>
              </NavLink>

              <NavLink
                to="/dashboard/rents/report"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <BarChart size={18} className="me-2" />
                <span>Rent Report</span>
              </NavLink>

              <NavLink
                to="/dashboard/expenses"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <FileText size={18} className="me-2" />
                <span>Expenses</span>
              </NavLink>

              <NavLink
                to="/dashboard/invoices"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <FileText size={18} className="me-2" />
                <span>Invoices</span>
              </NavLink>

              <NavLink
                to="/dashboard/admin/rent-requests"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <BarChart size={18} className="me-2" />
                <span>Rent Requests</span>
              </NavLink>
            </div>

            {/* Notifications */}
            <div className="sidebar-section-title">🔔 Alerts</div>
            <div className="sidebar-section">
              <div className="d-flex align-items-center px-3 py-2 rounded-2 text-white-50">
                <Bell size={18} className="me-2" />
                <span className="flex-grow-1">Notifications</span>
                <NotificationBell />
              </div>
            </div>

            {/* Account */}
            <div className="sidebar-section-title">⚙️ Account</div>
            <div className="sidebar-section">
              <NavLink
                to="/dashboard/profile"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <UserCircle size={18} className="me-2" />
                <span>My Profile</span>
              </NavLink>

              <NavLink
                to="/dashboard/settings"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="me-2" />
                <span>Settings</span>
              </NavLink>
            </div>
          </>
        )}

        {/* === Tenant Menu === */}
        {role === "tenant" && (
          <>
            <div className="sidebar-section-title">🏠 My Space</div>
            <div className="sidebar-section">
              <NavLink
                to="/dashboard/tenant"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <Home size={18} className="me-2" />
                <span>My Dashboard</span>
              </NavLink>

              <NavLink
                to="/dashboard/profile"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <UserCircle size={18} className="me-2" />
                <span>My Profile</span>
              </NavLink>

              {/* <NavLink
                to="/dashboard/settings"
                className={linkClass}
                onClick={() => setIsOpen(false)}
              >
                <Settings size={18} className="me-2" />
                <span>Settings</span>
              </NavLink> */}
            </div>
          </>
        )}

        <hr className="my-4 border-secondary" />

        {/* === Logout Button === */}
        <button
          onClick={handleLogout}
          className="btn w-100 d-flex align-items-center justify-content-center mt-auto logout-btn"
          onMouseEnter={(e) =>
            (e.target.style.transform = "translateY(-2px)")
          }
          onMouseLeave={(e) => (e.target.style.transform = "translateY(0)")}
        >
          <LogOut size={18} className="me-2" />
          Logout
        </button>
      </div>

      {/* Spacer for desktop */}
      <div className="d-none d-md-block" style={{ width: "260px" }} />
    </>
  );
};

export default Sidebar;
