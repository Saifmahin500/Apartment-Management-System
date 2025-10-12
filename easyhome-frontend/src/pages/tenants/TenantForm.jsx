import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Form, Button } from "react-bootstrap";

const TenantForm = ({ tenant, onSuccess }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    flat_id: "",
  });

  const [flats, setFlats] = useState([]);

  // 🔹 Fetch Flats
  useEffect(() => {
    const fetchFlats = async () => {
      try {
        const res = await api.get("/flats/simple");

        // Backend কখনও array দেয়, কখনও object দেয় (data key সহ)
        const flatData = Array.isArray(res.data)
          ? res.data
          : res.data.data
          ? res.data.data
          : [];

        setFlats(flatData);
      } catch (error) {
        console.error("Error fetching flats:", error);
      }
    };

    fetchFlats();

    if (tenant) setForm(tenant);
  }, [tenant]);

  // 🔹 Handle Form Input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
              {f.flat_number || f.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      <Button type="submit" variant="success" className="w-100">
        {tenant ? "Update" : "Add"} Tenant
      </Button>
    </Form>
  );
};

export default TenantForm;
