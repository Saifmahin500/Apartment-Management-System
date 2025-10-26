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
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading Dashboard...</p>
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

      <div className="container py-4">
        <h3 className="fw-bold mb-4 text-primary">🏠 Tenant Dashboard</h3>

          {/* 💳 Rent Summary Section */}
          <div className="row mt-4">
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3 border-primary">
              <h6>Total Rent</h6>
              <h4 className="text-primary">{summary.total} ৳</h4>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3 border-success">
              <h6>Paid Rent</h6>
              <h4 className="text-success">{summary.paid} ৳</h4>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3 border-danger">
              <h6>Due Rent</h6>
              <h4 className="text-danger">{summary.due} ৳</h4>
            </div>
          </div>
          <div className="col-md-3 mb-3">
            <div className="card shadow-sm text-center p-3 border-info">
              <h6>Last Payment</h6>
              <h5>{summary.last_month}</h5>
            </div>
          </div>
        </div>

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

        {/* 💰 Latest Rent */}
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

              {/* ✅ Pay Rent Button */}
              {latest_rent.status !== "Paid" && (
                <button
                  className="btn btn-primary mt-3"
                  onClick={handlePayRent}
                >
                  Pay Rent
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-info">No rent record found yet.</div>
        )}


      

        {/* 🧰 Recent Service Requests */}
        <div className="card shadow-sm border-0 mt-4">
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
