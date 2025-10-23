import React, { useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import api from "../../services/api";
import RentForm from "./RentForm";
import RentPaymentModal from "./RentPaymentModal";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../app.css";

const RentList = () => {
  const [rents, setRents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Load rent data
  const fetchRents = async () => {
    setLoading(true);
    try {
      const res = await api.get("/rents");
      setRents(res.data);
    } catch (err) {
      console.error("Error fetching rents:", err);
      setRents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRents();
  }, []);

  const handleAdd = () => {
    setSelectedRent(null);
    setShowModal(true);
  };

  const handleEdit = (rent) => {
    setSelectedRent(rent);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this rent record?")) {
      await api.delete(`/rents/${id}`);
      fetchRents();
    }
  };

  const handlePayment = (rent) => {
    setSelectedRent(rent);
    setShowPaymentModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedRent(null);
  };

  // 💡 Calculate summary
  const totalRent = rents.reduce((sum, r) => sum + (parseFloat(r.rent_amount) || 0), 0);
  const totalDue = rents.filter(r => r.status === "Due").reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);
  const totalPaid = rents.filter(r => r.status === "Paid").reduce((sum, r) => sum + (parseFloat(r.total_amount) || 0), 0);

  // 🌀 Loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#17A2B8", width: "60px", height: "60px" }} />
          <p className="text-muted mt-3">Loading rent records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid rent-container">
      {/* ===== Header ===== */}
      <div className="d-flex justify-content-between align-items-center rent-header mb-4">
        <div>
          <h2>
            <i className="fas fa-money-bill-wave me-3 text-info"></i>
            Rent Management
          </h2>
          <p>Track and manage all rent payments and charges</p>
        </div>
        <button className="btn btn-add-rent" onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i>Add New Rent Record
        </button>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card summary-card border-left-info">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-muted small mb-2 fw-semibold">Total Rent</p>
                  <h4 className="fw-bold summary-total">৳ {totalRent.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#e0f7fa" }}>
                  <i className="fas fa-coins fs-4 text-info"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card summary-card border-left-danger">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-muted small mb-2 fw-semibold">Amount Due</p>
                  <h4 className="fw-bold summary-due">৳ {totalDue.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#f8d7da" }}>
                  <i className="fas fa-exclamation-circle fs-4 text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card summary-card border-left-success">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <p className="text-muted small mb-2 fw-semibold">Amount Paid</p>
                  <h4 className="fw-bold summary-paid">৳ {totalPaid.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#e8f5e9" }}>
                  <i className="fas fa-check-circle fs-4 text-success"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Table Section ===== */}
      <div className="card rent-table-card">
        <div className="rent-table-header">
          <h5>
            <i className="fas fa-list me-2"></i>
            Rent Records ({rents.length})
          </h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Flat</th>
                <th>Month / Year</th>
                <th>Rent</th>
                <th>Utility</th>
                <th>Maintenance</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rents.length === 0 ? (
                <tr>
                  <td colSpan="9" className="rent-empty">
                    <i className="fas fa-inbox"></i>
                    <p>No rent records found. Create your first rent record!</p>
                  </td>
                </tr>
              ) : (
                rents.map((r, i) => (
                  <tr key={r.id}>
                    <td><span className="rent-index-badge">{i + 1}</span></td>
                    <td><strong>{r.flat?.name || "N/A"}</strong></td>
                    <td>
                      <i className="fas fa-calendar text-warning me-2"></i>
                      {r.month} / {r.year}
                    </td>
                    <td className="text-info fw-semibold">৳ {parseFloat(r.rent_amount).toLocaleString()}</td>
                    <td className="text-purple fw-semibold">৳ {parseFloat(r.utility_amount).toLocaleString()}</td>
                    <td className="text-warning fw-semibold">৳ {parseFloat(r.maintenance_charge).toLocaleString()}</td>
                    <td><span className="rent-total">৳ {parseFloat(r.total_amount).toLocaleString()}</span></td>
                    <td>
                      <span className={`rent-status ${r.status === "Paid" ? "paid" : "due"}`}>
                        <i className={`fas fa-${r.status === "Paid" ? "check-circle" : "clock"} me-1`}></i>
                        {r.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button className="btn-rent-edit" onClick={() => handleEdit(r)}>
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>

                        {r.status === "Due" && (
                          <button className="btn-rent-pay" onClick={() => handlePayment(r)}>
                            <i className="fas fa-money-bill me-1"></i>Pay
                          </button>
                        )}

                        <button className="btn-rent-delete" onClick={() => handleDelete(r.id)}>
                          <i className="fas fa-trash me-1"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modals ===== */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" backdrop="static">
        <Modal.Header className="rent-modal-header" closeButton closeVariant="white">
          <Modal.Title className="rent-modal-title">
            <i className="fas fa-file-invoice-dollar me-2"></i>
            {selectedRent ? "Edit Rent Record" : "Add New Rent Record"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <RentForm
            rent={selectedRent}
            onSuccess={(updatedRent) => {
              handleCloseModal();
              if (selectedRent) {
                setRents((prev) =>
                  prev.map((r) => (r.id === updatedRent.id ? updatedRent : r))
                );
              } else {
                setRents((prev) => [...prev, updatedRent]);
              }
            }}
          />
        </Modal.Body>
      </Modal>

      <RentPaymentModal
        show={showPaymentModal}
        handleClose={() => setShowPaymentModal(false)}
        rent={selectedRent}
        onSuccess={() => {
          setShowPaymentModal(false);
          fetchRents();
        }}
      />
    </div>
  );
};

export default RentList;
