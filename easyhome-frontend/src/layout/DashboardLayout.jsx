import React from "react";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1 bg-light" style={{ minHeight: "100vh" }}>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
