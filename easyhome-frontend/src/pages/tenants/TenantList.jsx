import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Button, Table, Modal } from "react-bootstrap";
import TenantForm from "./TenantForm";

const TenantList = () => {
  const [tenants, setTenants] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editTenant, setEditTenant] = useState(null);

  const fetchTenants = async () => {
    try {
      const res = await api.get("/tenants");
      setTenants(res.data);
    } catch (err) {
      console.error("Failed to load tenants", err);
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

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Tenants</h4>
        <Button variant="success" onClick={handleAdd}>
          + Add Tenant
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Flat</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map((t, i) => (
            <tr key={t.id}>
              <td>{i + 1}</td>
              <td>{t.name}</td>
              <td>{t.email}</td>
              <td>{t.phone}</td>
              <td>{t.flat?.name || "-"}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => handleEdit(t)}>
                  Edit
                </Button>{" "}
                <Button variant="danger" size="sm" onClick={() => handleDelete(t.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editTenant ? "Edit Tenant" : "Add Tenant"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TenantForm
            tenant={editTenant}
            onSuccess={() => {
              setShowModal(false);
              fetchTenants();
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TenantList;
