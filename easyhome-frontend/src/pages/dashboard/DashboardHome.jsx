import React, { useEffect, useState } from "react";
import API from "../../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import Chart from "chart.js/auto";

const DashboardHome = () => {
  const [summary, setSummary] = useState(null);
  const [recent, setRecent] = useState({ rents: [], expenses: [] });
  const [loading, setLoading] = useState(true);

  // ====== Fetch Summary & Recent Data ======
  useEffect(() => {
    Promise.all([
      API.get("/dashboard-summary"),
      API.get("/dashboard-recent"),
    ])
      .then(([summaryRes, recentRes]) => {
        setSummary(summaryRes.data.data);
        setRecent(recentRes.data.data);
      })
      .catch((err) => console.error("Dashboard Data Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // ====== Render Chart ======
  useEffect(() => {
    let chartInstance = null;
  
    if (summary) {
      const ctx = document.getElementById("rentExpenseChart");
  
      // Destroy previous chart if it exists
      if (Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy();
      }
  
      chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
          labels: ["Rent", "Expenses"],
          datasets: [
            {
              label: "This Month",
              data: [summary.this_month_rent, summary.this_month_expense],
              backgroundColor: ["#198754", "#dc3545"],
              borderRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: { beginAtZero: true },
          },
        },
      });
    }
  
    // Cleanup on unmount
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [summary]);
  

  // ====== Loading State ======
  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );

  if (!summary)
    return (
      <div className="text-center text-danger mt-5">
        <h5>Failed to load dashboard data.</h5>
      </div>
    );

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold mb-4">
        <i className="fa-solid fa-chart-line me-2 text-primary"></i>
        Dashboard Overview
      </h3>

      {/* ===== Row 1 ===== */}
      <div className="row g-4">
        <DashboardCard
          icon="fa-users"
          color="primary"
          title="Total Tenants"
          value={summary.total_tenants}
        />
        <DashboardCard
          icon="fa-building"
          color="success"
          title="Total Flats"
          value={summary.total_flats}
        />
        <DashboardCard
          icon="fa-chart-pie"
          color="warning"
          title="Available Flats"
          value={summary.available_flats}
        />
      </div>

      {/* ===== Row 2 ===== */}
      <div className="row g-4 mt-1">
        <DashboardCard
          icon="fa-money-bill-wave"
          color="info"
          title="Total Rent Collected"
          value={`৳ ${summary.total_rent_collected}`}
        />
        <DashboardCard
          icon="fa-wallet"
          color="danger"
          title="Total Expenses"
          value={`৳ ${summary.total_expenses}`}
        />
        <DashboardCard
          icon="fa-file-invoice"
          color="secondary"
          title="Total Invoices"
          value={summary.total_invoices}
        />
      </div>

      {/* ===== This Month Overview ===== */}
      <div className="mt-5">
        <h5 className="fw-semibold mb-3">
          <i className="fa-solid fa-calendar-days me-2 text-primary"></i>
          This Month Overview
        </h5>
        <div className="row g-4">
          <MonthlyCard
            icon="fa-hand-holding-dollar"
            color="success"
            title="Rent Collected"
            value={`৳ ${summary.this_month_rent}`}
          />
          <MonthlyCard
            icon="fa-coins"
            color="danger"
            title="Expenses"
            value={`৳ ${summary.this_month_expense}`}
          />
          <MonthlyCard
            icon="fa-file-invoice-dollar"
            color="primary"
            title="Invoices"
            value={summary.this_month_invoices}
          />
        </div>
      </div>

      {/* ===== Chart Section ===== */}
      <div className="card shadow-sm border-0 mt-5">
        <div className="card-header bg-primary text-white fw-semibold">
          <i className="fa-solid fa-chart-column me-2"></i>
          Rent vs Expense (This Month)
        </div>
        <div className="card-body">
          <canvas id="rentExpenseChart" height="120"></canvas>
        </div>
      </div>

      {/* ===== Recent Activity Section ===== */}
      <div className="row g-4 mt-4">
        {/* Recent Rent Payments */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-success text-white fw-semibold">
              <i className="fa-solid fa-hand-holding-dollar me-2"></i>
              Recent Rent Payments
            </div>
            <ul className="list-group list-group-flush">
              {recent.rents.length ? (
                recent.rents.map((r) => (
                  <li
                    key={r.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{r.month}</span>
                    <span className="fw-bold text-success">৳ {r.amount}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted text-center">
                  No recent rent payments.
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-danger text-white fw-semibold">
              <i className="fa-solid fa-coins me-2"></i>
              Recent Expenses
            </div>
            <ul className="list-group list-group-flush">
              {recent.expenses.length ? (
                recent.expenses.map((e) => (
                  <li
                    key={e.id}
                    className="list-group-item d-flex justify-content-between"
                  >
                    <span>{e.category_name}</span>
                    <span className="fw-bold text-danger">৳ {e.amount}</span>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-muted text-center">
                  No recent expenses.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

/* 🔹 Reusable Dashboard Card Component */
const DashboardCard = ({ icon, color, title, value }) => (
  <div className="col-md-4">
    <div
      className="card shadow-sm border-0 h-100 animate__animated animate__fadeInUp"
      style={{ transition: "0.3s" }}
    >
      <div className="card-body d-flex align-items-center">
        <i className={`fa-solid ${icon} text-${color} fa-2x me-3`}></i>
        <div>
          <h6 className="text-muted mb-1">{title}</h6>
          <h4 className="fw-bold mb-0">{value}</h4>
        </div>
      </div>
    </div>
  </div>
);

/* 🔹 Reusable Monthly Summary Card */
const MonthlyCard = ({ icon, color, title, value }) => (
  <div className="col-md-4">
    <div className="card bg-light border-0 h-100 text-center shadow-sm animate__animated animate__fadeInUp">
      <div className="card-body">
        <i className={`fa-solid ${icon} text-${color} fa-2x mb-2`}></i>
        <h6 className="text-muted">{title}</h6>
        <h4 className={`fw-bold text-${color}`}>{value}</h4>
      </div>
    </div>
  </div>
);

export default DashboardHome;
