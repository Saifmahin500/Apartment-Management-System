import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Form, Button } from "react-bootstrap";

const TenantForm = ({ tenant, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    flat_id: "",
    start_date: "",
    end_date: "",
    monthly_rent: "",
  });

  const [flats, setFlats] = useState([]);

  // 🔹 Fetch Flats
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const res = await api.get("/flats/simple");
        setFlats(res.data || []);
      } catch (error) {
        console.error("Error fetching flats:", error);
      }
    };

    fetchFlats();

    if (tenant) setForm(tenant);
  }, [tenant]);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // ✅ যদি flat select করা হয়
    if (name === "flat_id") {
      const selectedFlat = flats.find((flat) => flat.id == value);
      setForm({
        ...form,
        flat_id: value,
        monthly_rent: selectedFlat ? selectedFlat.rent_amount : "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 🔹 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (tenant) {
        await api.put(`/tenants/${tenant.id}`, form);
      } else {
        await api.post("/tenants", form);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving tenant:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />
      </Form.Group>

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
        <Form.Label>Start Date</Form.Label>
        <Form.Control
          name="start_date"
          type="date"
          value={form.start_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>End Date</Form.Label>
        <Form.Control
          name="end_date"
          type="date"
          value={form.end_date}
          onChange={handleChange}
          
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Monthly Rent</Form.Label>
        <Form.Control
          name="monthly_rent"
          type="number"
          value={form.monthly_rent}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Button type="submit" variant="success" className="w-100">
        {tenant ? "Update Tenant" : "Add Tenant"}
      </Button>
    </Form>
  );
};

export default TenantForm;
