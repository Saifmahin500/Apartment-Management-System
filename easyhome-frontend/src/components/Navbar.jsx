import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      className="d-flex align-items-center justify-content-between px-4"
      style={{
        backgroundColor: "#153837", 
        height: "64px",
        color: "#fff",
        width: "calc(100% - 240px)", 
        marginLeft: "9.5px", 
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
        position: "fixed",
        top: 0,
        zIndex: 1050,
      }}
    >
      {/* ✅ Brand */}
      <div className="d-flex align-items-center">
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#00c39a",
            fontWeight: "600",
            fontSize: "20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "24px",
              marginRight: "8px",
              color: "#00c39a",
            }}
          >
            🏠
          </span>
          EasyHome
        </Link>
      </div>

      {/* ✅ Right Section */}
      <div className="d-flex align-items-center gap-3">
        {/* Notifications */}
        <button
          className="btn btn-sm"
          style={{
            backgroundColor: "#1e4b4a",
            color: "#ffc107",
            border: "none",
            borderRadius: "8px",
            padding: "6px 12px",
            fontWeight: "500",
          }}
        >
          🔔 Notifications
        </button>

        {/* ✅ Profile Dropdown */}
        <div className="dropdown">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="btn btn-sm d-flex align-items-center"
            style={{
              backgroundColor: "#1e4b4a",
              color: "#00c39a",
              border: "none",
              borderRadius: "50px",
              padding: "6px 12px",
              fontWeight: "500",
            }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="User"
              width="28"
              height="28"
              style={{
                borderRadius: "50%",
                marginRight: "8px",
                border: "2px solid #00c39a",
              }}
            />
            <span>Saif</span>
          </button>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div
              className="dropdown-menu show"
              style={{
                display: "block",
                position: "absolute",
                right: "0",
                top: "60px",
                backgroundColor: "#1e4b4a",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.1)",
                minWidth: "160px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                overflow: "hidden",
              }}
            >
              <Link
                to="/dashboard/profile"
                className="dropdown-item"
                style={{
                  color: "#fff",
                  padding: "10px 16px",
                  textDecoration: "none",
                  display: "block",
                }}
                onClick={() => setShowDropdown(false)}
              >
                👤 Profile
              </Link>

              <Link
                to="/dashboard/settings"
                className="dropdown-item"
                style={{
                  color: "#fff",
                  padding: "10px 16px",
                  textDecoration: "none",
                  display: "block",
                }}
                onClick={() => setShowDropdown(false)}
              >
                ⚙️ Settings
              </Link>

              <button
                onClick={handleLogout}
                className="dropdown-item"
                style={{
                  color: "#ff6b6b",
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  width: "100%",
                  textAlign: "left",
                }}
              >
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
