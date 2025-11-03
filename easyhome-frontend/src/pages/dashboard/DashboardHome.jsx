import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Chart from "chart.js/auto";
import "../../app.css";

const DashboardHome = () => {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState({ rents: [], expenses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // ====== Fetch Summary & Recent Data ======
  useEffect(() => {
    Promise.all([
      API.get("/dashboard-summary"),
      API.get("/dashboard-recent"),
    ])
      .then(([summaryRes, recentRes]) => {
        setSummary(summaryRes?.data?.data || {});
        setRecent(recentRes?.data?.data || { rents: [], expenses: [] });
      })
      .catch((err) => {
        console.error("Dashboard Data Error:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // ====== Render Chart ======
  useEffect(() => {
    const ctx = document.getElementById("rentExpenseChart");
    if (!ctx || !summary) return;

    const existingChart = Chart.getChart(ctx);
    if (existingChart) existingChart.destroy();

    const chart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Rent Collected", "Expenses"],
        datasets: [
          {
            label: "This Month",
            data: [
              summary?.this_month_rent ?? 0,
              summary?.this_month_expense ?? 0,
            ],
            backgroundColor: ["#17A2B8", "#dc3545"],
            borderRadius: 10,
            borderSkipped: false,
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              color: "#6c757d",
              font: { size: 12, weight: 600 },
              callback: function (value) {
                return "৳ " + value.toLocaleString();
              },
            },
            grid: { color: "rgba(0,0,0,0.05)", drawBorder: false },
          },
          x: {
            ticks: { color: "#6c757d", font: { size: 13, weight: 600 } },
            grid: { display: false },
          },
        },
      },
    });

    return () => chart.destroy();
  }, [summary]);

  // ====== Loading State ======
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <div
            className="spinner-border mb-4 text-info"
            style={{ width: "60px", height: "60px", borderWidth: "4px" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h6 className="text-muted">Loading your dashboard...</h6>
        </div>
      </div>
    );

  // ====== Error or Empty Summary ======
  if (error || !summary)
    return (
      <div className="text-center text-danger mt-5">
        <h5>⚠️ Failed to load dashboard data.</h5>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-outline-info mt-3"
        >
          Retry
        </button>
      </div>
    );

  // ====== MAIN UI ======
  return (
    <div className="container-fluid dashboard-container">
      {/* ===== Header ===== */}
      <div className="dashboard-header mb-5">
        <h1>
          <i className="fas fa-tachometer-alt me-3 text-info"></i>
          Dashboard Overview
        </h1>
        <p>Real-time insights into your apartment management system</p>
      </div>

      {/* ===== Row 1: Main Metrics ===== */}
      <div className="row g-3 mb-4">
        <DashboardCard
          icon="fas fa-users"
          color="#17A2B8"
          bgColor="#e0f7fa"
          borderColor="#17A2B8"
          title="Total Tenants"
          value={summary?.total_tenants ?? 0}
          trend="+2 this month"
        />
        <DashboardCard
          icon="fas fa-building"
          color="#20c997"
          bgColor="#e8f5e9"
          borderColor="#20c997"
          title="Total Flats"
          value={summary?.total_flats ?? 0}
          trend="Active properties"
        />
        <DashboardCard
          icon="fas fa-door-open"
          color="#fd7e14"
          bgColor="#fff3e0"
          borderColor="#fd7e14"
          title="Available Flats"
          value={summary?.available_flats ?? 0}
          trend="Ready to rent"
        />
      </div>

      {/* ===== Row 2: Financial Overview ===== */}
      <div className="row g-3 mb-5">
        <DashboardCard
          icon="fas fa-hand-holding-usd"
          color="#17A2B8"
          bgColor="#e0f7fa"
          borderColor="#17A2B8"
          title="Total Rent Collected"
          value={`৳ ${summary?.total_rent_collected?.toLocaleString() ?? 0}`}
          trend="All time"
        />
        <DashboardCard
          icon="fas fa-wallet"
          color="#dc3545"
          bgColor="#f8d7da"
          borderColor="#dc3545"
          title="Total Expenses"
          value={`৳ ${summary?.total_expenses?.toLocaleString() ?? 0}`}
          trend="All time"
        />
        <DashboardCard
          icon="fas fa-file-invoice"
          color="#6f42c1"
          bgColor="#e7d4f5"
          borderColor="#6f42c1"
          title="Total Invoices"
          value={summary?.total_invoices ?? 0}
          trend="All generated"
        />
      </div>

      {/* ===== This Month Overview ===== */}
      <div className="mb-5">
        <div className="d-flex align-items-center mb-4">
          <i className="fas fa-calendar-alt text-info fs-4 me-2"></i>
          <h4 className="fw-bold mb-0 text-dark fs-5">This Month Overview</h4>
        </div>
        <div className="row g-3">
          <MonthlyCard
            icon="fas fa-coins"
            color="#20c997"
            bgColor="#e8f5e9"
            title="Rent Collected"
            value={`৳ ${summary?.this_month_rent?.toLocaleString() ?? 0}`}
          />
          <MonthlyCard
            icon="fas fa-piggy-bank"
            color="#dc3545"
            bgColor="#f8d7da"
            title="Expenses"
            value={`৳ ${summary?.this_month_expense?.toLocaleString() ?? 0}`}
          />
          <MonthlyCard
            icon="fas fa-receipt"
            color="#17A2B8"
            bgColor="#e0f7fa"
            title="Invoices Created"
            value={summary?.this_month_invoices ?? 0}
          />
        </div>
      </div>

      {/* ===== Chart Section ===== */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="dashboard-chart-card">
            <div className="dashboard-chart-header">
              <i className="fas fa-chart-bar me-3"></i>
              Monthly Financial Analysis
            </div>
            <div className="p-4 bg-white" style={{ height: "300px" }}>
              <canvas id="rentExpenseChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Dashboard Card */
const DashboardCard = ({ icon, color, bgColor, borderColor, title, value, trend }) => (
  <div className="col-md-6 col-lg-4">
    <div className="dashboard-card" style={{ borderLeft: `6px solid ${borderColor}` }}>
      <div className="card-body p-4">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <p className="text-muted small mb-2 fw-semibold text-uppercase">{title}</p>
            <h3 className="fw-bold mb-2 text-dark">{value}</h3>
            <p style={{ fontSize: "12px", color: color, fontWeight: "500" }}>
              <i className="fas fa-arrow-trend-up me-1"></i>
              {trend}
            </p>
          </div>
          <div
            style={{
              width: "65px",
              height: "65px",
              borderRadius: "12px",
              backgroundColor: bgColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <i className={icon} style={{ fontSize: "28px", color: color }}></i>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* 🔹 Monthly Card */
const MonthlyCard = ({ icon, color, bgColor, title, value }) => (
  <div className="col-md-6 col-lg-4">
    <div className="monthly-card" style={{ backgroundColor: bgColor }}>
      <div className="card-body p-4 text-center">
        <div
          style={{
            width: "75px",
            height: "75px",
            borderRadius: "15px",
            backgroundColor: "rgba(255,255,255,0.8)",
            margin: "0 auto 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <i className={icon} style={{ fontSize: "32px", color: color }}></i>
        </div>
        <h6 className="text-muted small mb-3 fw-semibold text-uppercase">{title}</h6>
        <h3 className="fw-bold mb-0" style={{ color: color }}>
          {value}
        </h3>
      </div>
    </div>
  </div>
);

export default DashboardHome;
