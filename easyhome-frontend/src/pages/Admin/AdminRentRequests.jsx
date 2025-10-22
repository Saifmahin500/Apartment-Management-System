import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import DashboardLayout from "../../layout/DashboardLayout";

export default function AdminRentRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [charge, setCharge] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.get("/admin/rent-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("RENT REQUEST DATA:", res.data);
      setRequests(res.data || []);
    } catch (error) {
      console.error("Failed to load rent requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (status === "approved" && !charge) {
      alert("Please enter approved charge amount!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axiosClient.put(
        `/admin/rent-requests/${id}/status`,
        { status, charge },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Request ${status} successfully!`);
      fetchRequests();
      setSelected(null);
      setCharge("");
    } catch (error) {
      console.error("Failed to update request status:", error);
    }
  };

  if (loading)
    return (
      <DashboardLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p>Loading rent requests...</p>
        </div>
      </DashboardLayout>
    );

  return (
    <DashboardLayout>
      <div className="container py-4">
        <h3 className="fw-bold mb-4">🧾 Rent Request Management</h3>

        {requests.length === 0 ? (
          <div className="text-center text-muted mt-5">
            <p>No rent requests found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Tenant</th>
                  <th>Flat</th>
                  <th>Status</th>
                  <th>Charge</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((r, index) => (
                  <tr key={r.id}>
                    <td>{index + 1}</td>
                    <td>{r.tenant?.name ?? `Tenant #${r.tenant_id}`}</td>
                    <td>{r.flat?.name ?? `Flat #${r.flat_id}`}</td>
                    <td>
                      <span
                        className={`badge text-uppercase ${
                          r.status === "pending"
                            ? "bg-warning"
                            : r.status === "approved"
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td>{r.charge ? `৳${r.charge}` : "-"}</td>
                    <td>
                      {new Date(r.created_at).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      {r.status === "pending" && (
                        <>
                          <button
                            className="btn btn-sm btn-success me-2"
                            onClick={() => setSelected(r.id)}
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleStatusUpdate(r.id, "rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ✅ Approve Modal */}
        {selected && (
          <div
            className="modal d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Approve Rent Request</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelected(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  <label className="form-label">Approved Charge (৳)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={charge}
                    onChange={(e) => setCharge(e.target.value)}
                  />
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setSelected(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => handleStatusUpdate(selected, "approved")}
                  >
                    Confirm Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
