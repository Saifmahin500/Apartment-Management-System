import React, { useEffect, useState } from "react";
import { Button, Table, Modal } from "react-bootstrap";
import api from "../../services/api";
import RentForm from "./RentForm";
import RentPaymentModal from "./RentPaymentModal";

const RentList = () => {
  const [rents, setRents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRent, setSelectedRent] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const fetchRents = async () => {
    const res = await api.get("/rents");
    setRents(res.data);
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
    if (window.confirm("Are you sure to delete this rent?")) {
      await api.delete(`/rents/${id}`);
      fetchRents();
    }
  };

  const handlePayment = (rent) => {
    setSelectedRent(rent);
    setShowPaymentModal(true);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h3>🏠 Rent Management</h3>
        <Button onClick={handleAdd} variant="success">+ Add Rent</Button>
      </div>

      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Flat</th>
            <th>Month</th>
            <th>Year</th>
            <th>Rent</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rents.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center">No rent records found</td>
            </tr>
          ) : (
            rents.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.flat?.name || "N/A"}</td>
                <td>{r.month}</td>
                <td>{r.year}</td>
                <td>{r.rent_amount}</td>
                <td>{r.total_amount}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === "Paid" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  <Button size="sm" variant="primary" onClick={() => handleEdit(r)}>
                    Edit
                  </Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>
                    Delete
                  </Button>{" "}
                  {r.status === "Due" && (
                    <Button size="sm" variant="warning" onClick={() => handlePayment(r)}>
                      Pay
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {/* Rent Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedRent ? "Edit Rent" : "Add Rent"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RentForm
            rent={selectedRent}
            onSuccess={() => {
              setShowModal(false);
              fetchRents();
            }}
          />
        </Modal.Body>
      </Modal>

      {/* Rent Payment Modal */}
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
