import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import DashboardLayout from "../../layout/DashboardLayout";

export default function TenantDashboard() {
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    paid: 0,
    due: 0,
    last_month: "N/A",
  });
  const [loading, setLoading] = useState(true);

  const handlePayRent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.post(
        "/tenant/pay-rent",
        {
          month: latest_rent.month,
          year: latest_rent.year,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      alert("✅ Rent Paid Successfully!");
      // Data reload করে fresh status দেখানো
      window.location.reload();
    } catch (error) {
      console.error("❌ Rent payment failed:", error);
      alert("❌ Rent payment failed! Please try again.");
    }
  };
  

  // ✅ Fetch tenant dashboard main data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosClient.get("/tenant/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Dashboard API response:", res.data);
        setData(res.data);
      } catch (err) {
        console.error("❌ Error fetching tenant dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // ✅ Fetch rent summary data
  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosClient.get("/tenant/rent-summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("✅ Rent Summary response:", res.data);
        setSummary(res.data);
      } catch (error) {
        console.error("❌ Failed to load rent summary:", error);
      }
    };

    fetchSummary();
  }, []);

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border" style={{ color: '#1C8A96' }} role="status"></div>
        <p className="mt-3" style={{ color: '#133232' }}>Loading Dashboard...</p>
      </div>
    );
  
  if (!data)
    return (
        <div className="text-center text-danger mt-5">
          <h5>⚠️ Failed to load dashboard data.</h5>
        </div>
    );

  const tenant = data?.tenant || {};
  const flat = data?.flat || null;
  const latest_rent = data?.latest_rent || null;
  const recent_requests = data?.recent_requests || [];

  return (
    <>
      <style>{`
        .brand-primary { color: #133232 !important; }
        .brand-secondary { color: #1C8A96 !important; }
        .bg-brand-primary { background-color: #133232 !important; }
        .bg-brand-secondary { background-color: #1C8A96 !important; }
        .border-brand-primary { border-color: #133232 !important; }
        .border-brand-secondary { border-color: #1C8A96 !important; }
        .btn-brand { 
          background-color: #1C8A96; 
          border-color: #1C8A96; 
          color: white;
        }
        .btn-brand:hover { 
          background-color: #133232; 
          border-color: #133232; 
          color: white;
        }
        .card-custom {
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .card-custom:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(28, 138, 150, 0.2);
        }
        .summary-card {
          border-left: 4px solid;
          border-radius: 8px;
        }
        .table thead {
          background-color: #133232;
          color: white;
        }
      `}</style>

      <div className="container py-4">
        <div className="d-flex align-items-center mb-4">
          <h3 className="fw-bold brand-primary mb-0">🏠 Tenant Dashboard</h3>
        </div>

        {/* 💳 Rent Summary Section */}
        <div className="row g-3 mb-4">
          <div className="col-md-3">
            <div className="card shadow-sm summary-card border-primary card-custom">
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-2">Total Rent</h6>
                <h3 className="brand-secondary fw-bold mb-0">{summary.total} ৳</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm summary-card border-success card-custom">
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-2">Paid Rent</h6>
                <h3 className="text-success fw-bold mb-0">{summary.paid} ৳</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm summary-card border-danger card-custom">
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-2">Due Rent</h6>
                <h3 className="text-danger fw-bold mb-0">{summary.due} ৳</h3>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card shadow-sm summary-card border-info card-custom">
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-2">Last Payment</h6>
                <h5 className="brand-primary fw-semibold mb-0">{summary.last_month}</h5>
              </div>
            </div>
          </div>
        </div>

        {/* 👤 Tenant Info */}
        <div className="card shadow-sm mb-4 border-0 card-custom">
          <div className="card-header bg-brand-secondary text-white py-3">
            <h5 className="mb-0 fw-bold">👤 Tenant Information</h5>
          </div>
          <div className="card-body p-4">
            <div className="row">
              <div className="col-md-4 mb-3">
                <p className="mb-1 text-muted small">Name</p>
                <p className="fw-semibold brand-primary">{tenant.name || "N/A"}</p>
              </div>
              <div className="col-md-4 mb-3">
                <p className="mb-1 text-muted small">Email</p>
                <p className="fw-semibold brand-primary">{tenant.email || "N/A"}</p>
              </div>
              <div className="col-md-4 mb-3">
                <p className="mb-1 text-muted small">Phone</p>
                <p className="fw-semibold brand-primary">{tenant.phone || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* 🏢 Flat Info */}
        {flat ? (
          <div className="card shadow-sm mb-4 border-0 card-custom">
            <div className="card-header bg-brand-primary text-white py-3">
              <h5 className="mb-0 fw-bold">🏢 Your Flat</h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Name</p>
                  <p className="fw-semibold brand-primary">{flat.name}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Flat Number</p>
                  <p className="fw-semibold brand-primary">{flat.flat_number}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Floor</p>
                  <p className="fw-semibold brand-primary">{flat.floor}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Rent</p>
                  <p className="fw-semibold brand-secondary">৳{flat.rent_amount}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Size</p>
                  <p className="fw-semibold brand-primary">{flat.size}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Status</p>
                  <span
                    className={`badge ${
                      flat.status === "occupied" ? "bg-success" : "bg-secondary"
                    }`}
                  >
                    {flat.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            No flat assigned yet.
          </div>
        )}

        {/* 💰 Latest Rent */}
        {latest_rent ? (
          <div className="card shadow-sm mb-4 border-0 card-custom">
            <div className="card-header py-3" style={{ backgroundColor: '#1C8A96', color: 'white' }}>
              <h5 className="mb-0 fw-bold">💰 Latest Rent</h5>
            </div>
            <div className="card-body p-4">
              <div className="row">
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Month</p>
                  <p className="fw-semibold brand-primary">{latest_rent.month}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Year</p>
                  <p className="fw-semibold brand-primary">{latest_rent.year}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Rent Amount</p>
                  <p className="fw-semibold brand-secondary">৳{latest_rent.rent_amount}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Utility Bill</p>
                  <p className="fw-semibold brand-primary">৳{latest_rent.utility_amount}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Maintenance Charge</p>
                  <p className="fw-semibold brand-primary">৳{latest_rent.maintenance_charge}</p>
                </div>
                <div className="col-md-4 mb-3">
                  <p className="mb-1 text-muted small">Total Amount</p>
                  <p className="fw-bold brand-secondary fs-5">৳{latest_rent.total_amount}</p>
                </div>
                <div className="col-12 mb-3">
                  <p className="mb-1 text-muted small">Status</p>
                  <span
                    className={`badge fs-6 ${
                      latest_rent.status === "Paid" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {latest_rent.status}
                  </span>
                </div>
              </div>

              {/* ✅ Pay Rent Button */}
              {latest_rent.status !== "Paid" && (
                <button
                  className="btn btn-brand btn-lg mt-3 px-4"
                  onClick={handlePayRent}
                >
                  💳 Pay Rent Now
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-info">
            <i className="bi bi-info-circle-fill me-2"></i>
            No rent record found yet.
          </div>
        )}

        {/* 🧰 Recent Service Requests */}
        <div className="card shadow-sm border-0 card-custom">
          <div className="card-header bg-brand-primary text-white py-3">
            <h5 className="mb-0 fw-bold">🧰 Recent Service Requests</h5>
          </div>
          <div className="card-body p-4">
            {recent_requests.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Service</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Charge</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent_requests.map((req, i) => (
                      <tr key={req.id}>
                        <td className="fw-semibold">{i + 1}</td>
                        <td>{req.service?.name || "N/A"}</td>
                        <td className="text-muted">{req.request_date}</td>
                        <td>
                          <span
                            className={`badge ${
                              req.status === "pending"
                                ? "bg-warning"
                                : req.status === "approved"
                                ? "bg-success"
                                : "bg-danger"
                            }`}
                          >
                            {req.status}
                          </span>
                        </td>
                        <td className="fw-semibold brand-secondary">{req.charge ? `৳${req.charge}` : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-muted text-center mb-0">No service requests found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}