import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import api from "../../services/api";

const RentForm = ({ rent, onSuccess }) => {
  const [form, setForm] = useState({
    flat_id: "",
    month: "",
    year: new Date().getFullYear(),
    rent_amount: "",
    utility_amount: "",
    maintenance_charge: "",
    total_amount: "",
    due_amount: "",
    status: "Due",
  });

  const [flats, setFlats] = useState([]);

  // Fetch Flats
  useEffect(() => {
    api.get("/flats/simple")
      .then((res) => {
        const flatData = Array.isArray(res.data) ? res.data : res.data.data;
        setFlats(flatData || []);
      })
      .catch((err) => console.error("Error loading flats:", err));
  }, []);
  

  // Update total automatically
  useEffect(() => {
    const total =
      (parseFloat(form.rent_amount) || 0) +
      (parseFloat(form.utility_amount) || 0) +
      (parseFloat(form.maintenance_charge) || 0);
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [form.rent_amount, form.utility_amount, form.maintenance_charge]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (rent) {
        await api.put(`/rents/${rent.id}`, form);
      } else {
        await api.post("/rents", form);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving rent:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Flat</Form.Label>
        <Form.Select
  name="flat_id"
  value={form.flat_id}
  onChange={handleChange}
  required
>
  <option value="">Select Flat</option>
  {flats.map((f) => (
    <option key={f.id} value={f.id}>
      {f.name}
    </option>
  ))}
</Form.Select>

      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Month</Form.Label>
        <Form.Control
          name="month"
          value={form.month}
          onChange={handleChange}
          placeholder="e.g. January"
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Year</Form.Label>
        <Form.Control
          name="year"
          type="number"
          value={form.year}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Rent Amount</Form.Label>
        <Form.Control
          name="rent_amount"
          type="number"
          value={form.rent_amount}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Utility Charge</Form.Label>
        <Form.Control
          name="utility_amount"
          type="number"
          value={form.utility_amount}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Maintenance Charge</Form.Label>
        <Form.Control
          name="maintenance_charge"
          type="number"
          value={form.maintenance_charge}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Total Amount</Form.Label>
        <Form.Control
          type="number"
          value={form.total_amount}
          readOnly
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Due">Due</option>
          <option value="Paid">Paid</option>
        </Form.Select>
      </Form.Group>

      <Button type="submit" variant="success" className="w-100">
        {rent ? "Update Rent" : "Add Rent"}
      </Button>
    </Form>
  );
};

export default RentForm;
