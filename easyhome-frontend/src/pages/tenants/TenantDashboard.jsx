import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import DashboardLayout from "../../layout/DashboardLayout";

export default function TenantDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading)
    return (
      <DashboardLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading Dashboard...</p>
        </div>
      </DashboardLayout>
    );

  if (!data)
    return (
      <DashboardLayout>
        <div className="text-center text-danger mt-5">
          <h5>⚠️ Failed to load dashboard data.</h5>
        </div>
      </DashboardLayout>
    );

  const tenant = data?.tenant || {};
  const flat = data?.flat || null;
  const latest_rent = data?.latest_rent || null;
  const recent_requests = data?.recent_requests || [];

  return (
      <div className="container py-4">
        <h3 className="fw-bold mb-4 text-primary">🏠 Tenant Dashboard</h3>

        {/* 👤 Tenant Info */}
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body">
            <h5 className="card-title text-primary fw-bold mb-3">
              👤 Tenant Information
            </h5>
            <p><strong>Name:</strong> {tenant.name || "N/A"}</p>
            <p><strong>Email:</strong> {tenant.email || "N/A"}</p>
            <p><strong>Phone:</strong> {tenant.phone || "N/A"}</p>
          </div>
        </div>

        {/* 🏢 Flat Info */}
        {flat ? (
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h5 className="card-title text-success fw-bold mb-3">🏢 Your Flat</h5>
              <p><strong>Name:</strong> {flat.name}</p>
              <p><strong>Flat Number:</strong> {flat.flat_number}</p>
              <p><strong>Floor:</strong> {flat.floor}</p>
              <p><strong>Rent:</strong> ৳{flat.rent_amount}</p>
              <p><strong>Size:</strong> {flat.size}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ms-2 ${
                    flat.status === "occupied" ? "bg-success" : "bg-secondary"
                  }`}
                >
                  {flat.status}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">No flat assigned yet.</div>
        )}

        {/* 💰 Rent Info */}
        {latest_rent ? (
          <div className="card shadow-sm mb-4 border-0">
            <div className="card-body">
              <h5 className="card-title text-warning fw-bold mb-3">
                💰 Latest Rent
              </h5>
              <p><strong>Month:</strong> {latest_rent.month}</p>
              <p><strong>Year:</strong> {latest_rent.year}</p>
              <p><strong>Amount:</strong> ৳{latest_rent.rent_amount}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`badge ms-2 ${
                    latest_rent.status === "Paid" ? "bg-success" : "bg-danger"
                  }`}
                >
                  {latest_rent.status}
                </span>
              </p>
            </div>
          </div>
        ) : (
          <div className="alert alert-info">No rent record found yet.</div>
        )}

        

        {/* 🧰 Recent Requests */}
        <div className="card shadow-sm border-0">
          <div className="card-body">
            <h5 className="card-title text-secondary fw-bold mb-3">
              🧰 Recent Service Requests
            </h5>
            {recent_requests.length > 0 ? (
              <table className="table table-bordered align-middle">
                <thead className="table-dark">
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
                      <td>{i + 1}</td>
                      <td>{req.service?.name || "N/A"}</td>
                      <td>{req.request_date}</td>
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
                      <td>{req.charge || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted">No service requests found.</p>
            )}
          </div>
        </div>
      </div>
    
  );
}
