import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = () => {
  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ✅ Sidebar Section */}
      <div
        className="bg-dark text-white"
        style={{
          width: "240px",
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 1020,
        }}
      >
        <Sidebar />
      </div>

      {/* ✅ Main Content Area */}
      <div
        className="flex-grow-1"
        style={{
          marginLeft: "240px", // Sidebar এর width অনুযায়ী
          backgroundColor: "#f8f9fa",
          width: "calc(100% - 240px)",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ✅ Navbar Section */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: "240px", // 🧩 Navbar Sidebar এর ডান দিক থেকে শুরু হবে
            right: 0,
            zIndex: 1050,
          }}
        >
          <Navbar />
        </div>

        {/* ✅ Page Content Section */}
        <div
          className="p-4 flex-grow-1"
          style={{
            marginTop: "64px", // Navbar এর height অনুযায়ী নিচ থেকে শুরু
            overflowY: "auto",
            height: "calc(100vh - 64px)",
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
