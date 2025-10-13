import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";


const DashboardLayout = () => {
  return (
    <div className="d-flex" style={{ minHeight: "100vh", overflow: "hidden" }}>
      {/* ✅ Sidebar */}
      <div
        className="bg-dark text-white"
        style={{
          width: "240px",
          minHeight: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
        }}
      >
        <Sidebar />
      </div>

      {/* ✅ Main Content Area */}
      <div
        className="flex-grow-1 p-4"
        style={{
          marginLeft: "240px",
          backgroundColor: "#f8f9fa",
          width: "calc(100% - 240px)",
        }}
      >
        <Outlet /> 
      </div>
    </div>
  );
};

export default DashboardLayout;
