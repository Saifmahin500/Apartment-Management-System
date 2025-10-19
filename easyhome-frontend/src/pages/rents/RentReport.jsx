import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import api from "../../services/api";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../app.css"; // ✅ Global CSS import

const RentReport = () => {
  const [rents, setRents] = useState([]);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const [summary, setSummary] = useState({ total: 0, paid: 0, due: 0 });
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch rent data
  const fetchRents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rents");
      let data = res.data;

      if (filter.month) data = data.filter((r) => r.month === filter.month);
      if (filter.year) data = data.filter((r) => r.year == filter.year);

      setRents(data);

      const total = data.reduce((acc, r) => acc + (parseFloat(r.total_amount) || 0), 0);
      const paid = data
        .filter((r) => r.status === "Paid")
        .reduce((acc, r) => acc + (parseFloat(r.total_amount) || 0), 0);
      const due = total - paid;

      setSummary({ total, paid, due });
    } catch (err) {
      console.error("Error fetching rents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRents();
  }, [filter]);

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  // 🌀 Loading State
  if (loading && rents.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#17A2B8", width: "60px", height: "60px" }} />
          <p className="text-muted mt-3">Loading rent report...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid rent-report-container">
      {/* ===== Header ===== */}
      <div className="rent-report-header mb-5">
        <h2>
          <i className="fas fa-chart-pie me-3 text-info"></i>
          Rent Summary Report
        </h2>
        <p>View detailed rent collection and payment status report</p>
      </div>

      {/* ===== Filter Section ===== */}
      <div className="card rent-filter-card mb-5">
        <h6 className="rent-filter-title">
          <i className="fas fa-filter"></i>
          Filter Records
        </h6>
        <div className="row g-3">
          <div className="col-md-6">
            <Form.Group>
              <Form.Label className="rent-form-label">
                <i className="fas fa-calendar me-2 text-warning"></i>
                Select Month
              </Form.Label>
              <Form.Select
                value={filter.month}
                onChange={(e) => setFilter({ ...filter, month: e.target.value })}
                className="rent-form-select"
              >
                <option value="">All Months</option>
                {months.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>

          <div className="col-md-6">
            <Form.Group>
              <Form.Label className="rent-form-label">
                <i className="fas fa-calendar-alt me-2 text-purple"></i>
                Select Year
              </Form.Label>
              <Form.Select
                value={filter.year}
                onChange={(e) => setFilter({ ...filter, year: e.target.value })}
                className="rent-form-select"
              >
                <option value="">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </div>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card report-summary-card border-left-info">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-muted small mb-2 fw-semibold">Total Rent</p>
                  <h4 className="fw-bold text-info">৳ {summary.total.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#e0f7fa" }}>
                  <i className="fas fa-coins text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card report-summary-card border-left-success">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-muted small mb-2 fw-semibold">Amount Paid</p>
                  <h4 className="fw-bold text-success">৳ {summary.paid.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#e8f5e9" }}>
                  <i className="fas fa-check-circle text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card report-summary-card border-left-danger">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-muted small mb-2 fw-semibold">Amount Due</p>
                  <h4 className="fw-bold text-danger">৳ {summary.due.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#f8d7da" }}>
                  <i className="fas fa-exclamation-circle text-danger fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Report Table ===== */}
      <div className="card rent-report-table">
        <div className="rent-report-table-header">
          <h5>
            <i className="fas fa-list me-2"></i>
            Rent Report ({rents.length})
          </h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Flat</th>
                <th>Month</th>
                <th>Year</th>
                <th>Total Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="report-empty">
                    <i className="fas fa-inbox"></i>
                    <p>No records found for the selected filters</p>
                  </td>
                </tr>
              ) : (
                rents.map((r, i) => (
                  <tr key={r.id}>
                    <td>
                      <span className="report-index-badge">{i + 1}</span>
                    </td>
                    <td><strong>{r.flat?.name || "N/A"}</strong></td>
                    <td>{r.month}</td>
                    <td className="fw-semibold">{r.year}</td>
                    <td>
                      <span className="report-total-tag">
                        ৳ {parseFloat(r.total_amount).toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <span className={`report-status ${r.status === "Paid" ? "paid" : "due"}`}>
                        <i className={`fas fa-${r.status === "Paid" ? "check-circle" : "clock"} me-1`}></i>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Summary Footer ===== */}
      <div className="report-footer mt-4">
        <p>
          <i className="fas fa-info-circle me-1"></i>
          Report generated showing {rents.length} rent records
          {filter.month && ` for ${filter.month}`}
          {filter.year && ` in ${filter.year}`}
        </p>
      </div>
    </div>
  );
};

export default RentReport;
