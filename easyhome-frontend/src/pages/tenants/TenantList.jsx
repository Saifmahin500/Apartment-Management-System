import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Modal, Spinner } from "react-bootstrap";
import TenantForm from "./TenantForm";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../app.css"; // ✅ Import your app.css

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTenant, setEditTenant] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🧠 Fetch tenants
  const fetchTenants = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tenants");
      const tenantData = Array.isArray(res.data) ? res.data : res.data.data;
      setTenants(tenantData || []);
    } catch (err) {
      console.error("Failed to load tenants", err);
      setTenants([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, []);

  const handleEdit = (tenant) => {
    setEditTenant(tenant);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditTenant(null);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      await api.delete(`/tenants/${id}`);
      fetchTenants();
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditTenant(null);
  };

  // 🌀 Loading State
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#17A2B8", width: "60px", height: "60px" }} />
          <p className="text-muted mt-3">Loading tenants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid tenant-container">
      {/* ===== Header ===== */}
      <div className="d-flex justify-content-between align-items-center tenant-header mb-4">
        <div>
          <h2>
            <i className="fas fa-users me-3 text-info"></i>
            Tenant Management
          </h2>
          <p>Manage all your apartment tenants and residents</p>
        </div>
        <button className="btn btn-add-tenant" onClick={handleAdd}>
          <i className="fas fa-plus me-2"></i>Add New Tenant
        </button>
      </div>

      {/* ===== Table ===== */}
      <div className="card tenant-table-card">
        <div className="tenant-table-header">
          <h5>
            <i className="fas fa-list me-2"></i>All Tenants ({tenants.length})
          </h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Flat</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.length > 0 ? (
                tenants.map((t, i) => (
                  <tr key={t.id}>
                    <td>
                      <span className="tenant-index-badge">{i + 1}</span>
                    </td>
                    <td>
                      <span className="fw-semibold text-dark">
                        <i className="fas fa-user-circle me-2 text-info"></i>
                        {t.name}
                      </span>
                    </td>
                    <td>
                      <a href={`mailto:${t.email}`} className="text-info text-decoration-none">
                        {t.email}
                      </a>
                    </td>
                    <td>
                      <a href={`tel:${t.phone}`} className="text-info text-decoration-none">
                        {t.phone}
                      </a>
                    </td>
                    <td>
                      <span className="tenant-flat-badge">
                        <i className="fas fa-door-open me-1"></i>
                        {t.flat?.name || "-"}
                      </span>
                    </td>
                    <td>
                      <i className="fas fa-calendar me-2 text-warning"></i>
                      {new Date(t.start_date).toLocaleDateString("en-GB")}
                    </td>
                    <td>
                      <i className="fas fa-calendar me-2 text-danger"></i>
                      {t.end_date ? new Date(t.end_date).toLocaleDateString("en-GB") : ""}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn-tenant-edit" onClick={() => handleEdit(t)}>
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>
                        <button className="btn-tenant-delete" onClick={() => handleDelete(t.id)}>
                          <i className="fas fa-trash me-1"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="tenant-empty">
                    <i className="fas fa-inbox"></i>
                    <p>No tenants found. Add your first tenant!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal ===== */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" backdrop="static">
        <Modal.Header className="tenant-modal-header" closeButton closeVariant="white">
          <Modal.Title className="tenant-modal-title">
            <i className="fas fa-user-plus me-2"></i>
            {editTenant ? "Edit Tenant" : "Add New Tenant"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <TenantForm
            tenant={editTenant}
            onSuccess={() => {
              handleCloseModal();
              fetchTenants();
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TenantList;
