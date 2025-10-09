import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ✅ Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// ✅ Layout & Route Protection
import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";

// ✅ Dashboard & Feature Pages
import DashboardHome from "../pages/dashboard/DashboardHome";
import Profile from "../pages/dashboard/Profile";
import TenantList from "../pages/tenants/TenantList";
import TenantDashboard from "../pages/tenants/TenantDashboard";
import FlatList from "../pages/flats/FlatList";
import Unauthorized from "../pages/Unauthorized";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🔐 Protected Dashboard Routes */}
        <Route
          path="/dashboard/*"
          element={
            <ProtectedRoute allowedRoles={["admin", "owner", "tenant"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* 🏠 Dashboard Home */}
          <Route index element={<DashboardHome />} />

          {/* 👤 Profile */}
          <Route
            path="profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner", "tenant"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 🏠 Flats (Admin/Owner Only) */}
          <Route
            path="flats"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <FlatList />
              </ProtectedRoute>
            }
          />

          {/* 🧱 Tenants */}
          <Route
            path="tenants"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <TenantList />
              </ProtectedRoute>
            }
          />

          {/* 👥 Tenant Dashboard */}
          <Route
            path="tenant"
            element={
              <ProtectedRoute allowedRoles={["tenant"]}>
                <TenantDashboard />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 🚫 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="text-center mt-5 text-danger">
              <h3>404 – Page Not Found</h3>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
