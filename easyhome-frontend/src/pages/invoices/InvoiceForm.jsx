import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import api from "../../services/api";

const InvoiceForm = ({ invoice, onSuccess }) => {
  const [form, setForm] = useState({
    flat_id: "",
    tenant_id: "",
    total_amount: "",
    due_date: "",
    notes: "",
    status:"Unpaid",
  });

  const [flats, setFlats] = useState([]);
  const [tenants, setTenants] = useState([]);

  useEffect(() => {
    api.get("/flats/simple").then((res) => setFlats(res.data));
    api.get("/tenants").then((res) => setTenants(res.data));
    if (invoice) setForm(invoice);
  }, [invoice]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (invoice) await api.put(`/invoices/${invoice.id}`, form);
    else await api.post("/invoices", form);
    onSuccess();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Flat</Form.Label>
        <Form.Select name="flat_id" value={form.flat_id} onChange={handleChange} required>
          <option value="">Select Flat</option>
          {flats.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Tenant</Form.Label>
        <Form.Select name="tenant_id" value={form.tenant_id} onChange={handleChange} required>
          <option value="">Select Tenant</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Total Amount</Form.Label>
        <Form.Control type="number" name="total_amount" value={form.total_amount} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Due Date</Form.Label>
        <Form.Control type="date" name="due_date" value={form.due_date} onChange={handleChange} required />
      </Form.Group>

            <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
            name="status"
            value={form.status || "Unpaid"}
            onChange={handleChange}
        >
            <option value="Unpaid">Unpaid</option>
            <option value="Paid">Paid</option>
        </Form.Select>
        </Form.Group>


      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control as="textarea" rows={2} name="notes" value={form.notes} onChange={handleChange} />
      </Form.Group>

      <Button type="submit" variant="success" className="w-100">
        {invoice ? "Update Invoice" : "Add Invoice"}
      </Button>
    </Form>
  );
};

export default InvoiceForm;
