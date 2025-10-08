import React from "react";

const AuthLayout = ({ title, children }) => {
  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "400px",
          borderRadius: "20px",
          backgroundColor: "white",
        }}
      >
        <h3 className="text-center mb-4 text-dark fw-bold">{title}</h3>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
