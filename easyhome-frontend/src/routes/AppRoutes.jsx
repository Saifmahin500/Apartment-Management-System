import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔐 Auth Pages
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";

// 🧱 Layouts & Protection
import ProtectedRoute from "../routes/ProtectedRoute";
import DashboardLayout from "../layout/DashboardLayout";

// 📊 Dashboard & Modules
import DashboardHome from "../pages/dashboard/DashboardHome";
import ProfilePage from "../pages/Profile/ProfilePage";
import FlatList from "../pages/flats/FlatList";
import TenantList from "../pages/tenants/TenantList";
import TenantDashboard from "../pages/tenants/TenantDashboard";
import RentList from "../pages/rents/RentList";
import RentReport from "../pages/rents/RentReport";
import ExpenseList from "../pages/expenses/ExpenseList";
import InvoiceList from "../pages/invoices/InvoiceList";
import SettingsPage from "../pages/settings/SettingsPage";

// 🌐 Public Website Pages
import Home from "../pages/public/Home";
import About from "../pages/Public/About";
import Contact from "../pages/Public/Contact";
import Flats from "../pages/Public/Flats";
import FlatDetails from "../pages/flats/FlatDetails"; 
import Services from "../pages/Public/Services";

// 🧰 Service Request System
import TenantServices from "../pages/tenants/TenantServices";
import MyRequests from "../pages/tenants/MyRequests";
import AdminServices from "../pages/admin/AdminServices";
import AdminServiceRequests from "../pages/admin/AdminServiceRequests";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* 🌍 Public Website Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/flats" element={<Flats />} />
        <Route path="/flats/:id" element={<FlatDetails />} /> 
        <Route path="/services" element={<Services />} />

        {/* 🔐 Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* 🧭 Protected Dashboard (Admin / Owner / Tenant) */}
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
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* ⚙️ Settings */}
          <Route
            path="settings"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner", "tenant"]}>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* 🏘 Flats */}
          <Route
            path="flats"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <FlatList />
              </ProtectedRoute>
            }
          />

          {/* 👥 Tenants */}
          <Route
            path="tenants"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <TenantList />
              </ProtectedRoute>
            }
          />

          {/* 💰 Rent Management */}
          <Route
            path="rents"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <RentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="rents/report"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <RentReport />
              </ProtectedRoute>
            }
          />

          {/* 💵 Expense Management */}
          <Route
            path="expenses"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <ExpenseList />
              </ProtectedRoute>
            }
          />

          {/* 📜 Invoice Management */}
          <Route
            path="invoices"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <InvoiceList />
              </ProtectedRoute>
            }
          />

          {/* 🧰 Phase-13: Service System */}

          {/* 👨‍🔧 Tenant Pages */}
          <Route
            path="tenant/services"
            element={
              <ProtectedRoute allowedRoles={["tenant"]}>
                <TenantServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="tenant/requests"
            element={
              <ProtectedRoute allowedRoles={["tenant"]}>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍💼 Admin Pages */}
          <Route
            path="admin/services"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/service-requests"
            element={
              <ProtectedRoute allowedRoles={["admin", "owner"]}>
                <AdminServiceRequests />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍💼 Tenant Dashboard Overview */}
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
              <p>The page you are looking for does not exist.</p>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
