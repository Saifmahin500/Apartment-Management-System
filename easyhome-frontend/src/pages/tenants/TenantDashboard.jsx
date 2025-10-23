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
        setData(res.data);
      } catch (error) {
        console.error("Failed to load tenant dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary"></div>
          <p>Loading Tenant Dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="fw-bold mb-4">🏠 Tenant Dashboard Overview</h3>

        {/* Tenant Info */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-2">👤 Tenant Information</h5>
            <p><strong>Name:</strong> {data?.tenant?.name}</p>
            <p><strong>Email:</strong> {data?.tenant?.email}</p>
            <p><strong>Phone:</strong> {data?.tenant?.phone}</p>
          </div>
        </div>

        {/* Current Flat */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-2">🏢 Current Flat</h5>
            {data?.flat ? (
              <>
                <p><strong>Flat:</strong> {data.flat.name}</p>
                <p><strong>Floor:</strong> {data.flat.floor}</p>
                <p><strong>Status:</strong> {data.flat.status}</p>
                <p><strong>Rent Amount:</strong> ৳{data.flat.rent_amount}/month</p>
              </>
            ) : (
              <p className="text-muted">No flat assigned yet.</p>
            )}
          </div>
        </div>

        {/* Latest Rent */}
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-2">💰 Latest Rent</h5>
            {data?.latest_rent ? (
              <>
                <p><strong>Month:</strong> {data.latest_rent.month}</p>
                <p><strong>Amount:</strong> ৳{data.latest_rent.rent_amount}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      data.latest_rent.status === "Paid"
                        ? "bg-success"
                        : "bg-warning"
                    }`}
                  >
                    {data.latest_rent.status}
                  </span>
                </p>
              </>
            ) : (
              <p className="text-muted">No rent record found.</p>
            )}
          </div>
        </div>

        {/* Recent Service Requests */}
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">🧰 Recent Service Requests</h5>
            {data?.recent_requests?.length > 0 ? (
              <ul className="list-group">
                {data.recent_requests.map((req) => (
                  <li
                    key={req.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {req.service?.name || "Service"}
                    <span
                      className={`badge ${
                        req.status === "pending"
                          ? "bg-warning"
                          : req.status === "completed"
                          ? "bg-success"
                          : "bg-danger"
                      }`}
                    >
                      {req.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted">No recent service requests.</p>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
