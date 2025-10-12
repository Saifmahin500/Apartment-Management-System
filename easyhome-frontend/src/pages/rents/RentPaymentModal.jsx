import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import api from "../../services/api";

const RentPaymentModal = ({ show, handleClose, rent, onSuccess }) => {
  const [form, setForm] = useState({
    amount_paid: "",
    payment_method: "Cash",
    transaction_id: "",
    payment_date: "",
    bank_name: "",
    account_number: "",
    account_holder: "",
  });

  // ✅ যখন modal খুলবে বা rent পরিবর্তন হবে, তখন amount auto set হবে
  useEffect(() => {
    if (rent) {
      setForm((prev) => ({
        ...prev,
        amount_paid: rent.total_amount || "", // auto-fill total_amount
      }));
    }
  }, [rent]);

  // 🧠 Input change handle
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // 💾 Submit payment
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/rents/${rent.id}/pay`, form);
      onSuccess();
      handleClose(); // modal close after success
    } catch (error) {
      console.error("Payment Error:", error);
      alert("❌ Payment failed. Check console for details.");
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
          {/* 💰 Amount */}
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

          {/* 💳 Payment Method */}
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

          {/* 🔢 Transaction ID (for Bkash/Nagad) */}
          {(form.payment_method === "Bkash" ||
            form.payment_method === "Nagad") && (
            <Form.Group className="mb-3">
              <Form.Label>Transaction ID</Form.Label>
              <Form.Control
                name="transaction_id"
                value={form.transaction_id}
                onChange={handleChange}
                placeholder="Enter Transaction ID"
                required
              />
            </Form.Group>
          )}

          {/* 🏦 Bank Transfer Details */}
          {form.payment_method === "Bank Transfer" && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Bank Name</Form.Label>
                <Form.Control
                  name="bank_name"
                  value={form.bank_name}
                  onChange={handleChange}
                  placeholder="e.g. City Bank"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Account Holder Name</Form.Label>
                <Form.Control
                  name="account_holder"
                  value={form.account_holder}
                  onChange={handleChange}
                  placeholder="e.g. Saif Uddin"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Account Number</Form.Label>
                <Form.Control
                  name="account_number"
                  value={form.account_number}
                  onChange={handleChange}
                  placeholder="e.g. 1234567890"
                  required
                />
              </Form.Group>
            </>
          )}

          {/* 📅 Payment Date */}
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

          {/* ✅ Confirm Button */}
          <Button type="submit" variant="success" className="w-100">
            Confirm Payment
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default RentPaymentModal;
