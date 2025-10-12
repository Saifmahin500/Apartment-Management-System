import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../../services/api";

const RentPaymentModal = ({ show, handleClose, rent, onSuccess }) => {
  const [form, setForm] = useState({
    amount_paid: "",
    payment_method: "Cash",
    transaction_id: "",
    payment_date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/rents/${rent.id}/pay`, form);
      onSuccess();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  if (!rent) return null;

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>💳 Pay Rent for {rent?.flat?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Amount to Pay</Form.Label>
            <Form.Control
              type="number"
              name="amount_paid"
              value={form.amount_paid}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Method</Form.Label>
            <Form.Select
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
            >
              <option value="Cash">Cash</option>
              <option value="Bkash">Bkash</option>
              <option value="Nagad">Nagad</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Transaction ID</Form.Label>
            <Form.Control
              name="transaction_id"
              value={form.transaction_id}
              onChange={handleChange}
              placeholder="If applicable"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Payment Date</Form.Label>
            <Form.Control
              type="date"
              name="payment_date"
              value={form.payment_date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button type="submit" variant="success" className="w-100">
            Confirm Payment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RentPaymentModal;
