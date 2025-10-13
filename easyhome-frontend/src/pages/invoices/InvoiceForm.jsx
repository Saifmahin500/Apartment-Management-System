import React, { useState, useEffect } from "react";
import { Form, Button, Card } from "react-bootstrap";
import api from "../../services/api";

const InvoiceForm = ({ invoice, onSuccess }) => {
  const [form, setForm] = useState({
    flat_id: "",
    tenant_id: "",
    total_amount: "",
    due_date: "",
    notes: "",
    status: "Unpaid",
  });

  const [flats, setFlats] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [rentDetails, setRentDetails] = useState(null); // ✅ rent breakdown রাখার জন্য

  useEffect(() => {
    api.get("/flats/simple").then((res) => setFlats(res.data));
    if (invoice) setForm(invoice);
  }, [invoice]);

  // ✅ যখন Flat সিলেক্ট করবে
  const handleFlatChange = async (e) => {
    const flatId = e.target.value;
    setForm({ ...form, flat_id: flatId });

    if (!flatId) return;

    try {
      // Rent থেকে total, status, tenant আনবে
      const rentRes = await api.get(`/rents/latest/${flatId}`);
      const rent = rentRes.data;

      if (rent) {
        setForm((prev) => ({
          ...prev,
          total_amount: rent.total_amount || "",
          status: rent.status || "Unpaid",
          tenant_id: rent.tenant_id || "",
        }));

        // ✅ rent breakdown details set করো
        setRentDetails({
          rent_amount: rent.rent_amount || 0,
          utility_amount: rent.utility_amount || 0,
          maintenance_charge: rent.maintenance_charge || 0,
          total_amount: rent.total_amount || 0,
        });
      }

      // ✅ Tenant filter করবে ওই flat অনুযায়ী
      const tenantRes = await api.get(`/tenants/by-flat/${flatId}`);
      setTenants(tenantRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (invoice) await api.put(`/invoices/${invoice.id}`, form);
      else await api.post("/invoices", form);
      onSuccess();
    } catch (error) {
      console.error("Error saving invoice:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* 🏢 Flat */}
      <Form.Group className="mb-3">
        <Form.Label>Flat</Form.Label>
        <Form.Select
          name="flat_id"
          value={form.flat_id}
          onChange={handleFlatChange}
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

      {/* 👤 Tenant */}
      <Form.Group className="mb-3">
        <Form.Label>Tenant</Form.Label>
        <Form.Select
          name="tenant_id"
          value={form.tenant_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Tenant</option>
          {tenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* 💰 Total */}
      <Form.Group className="mb-3">
        <Form.Label>Total Amount</Form.Label>
        <Form.Control
          type="number"
          name="total_amount"
          value={form.total_amount}
          onChange={handleChange}
          readOnly
        />
      </Form.Group>

      {/* 🧾 Rent Breakdown Box */}
      {rentDetails && (
        <Card className="mb-3 shadow-sm border-success">
          <Card.Body>
            <h6 className="fw-bold text-success mb-2">Rent Breakdown</h6>
            <p className="mb-1">🏠 Rent: ৳{rentDetails.rent_amount}</p>
            <p className="mb-1">💡 Utility: ৳{rentDetails.utility_amount}</p>
            <p className="mb-1">🧰 Maintenance: ৳{rentDetails.maintenance_charge}</p>
            <hr />
            <p className="fw-bold text-dark">
              ➕ Total: ৳{rentDetails.total_amount}
            </p>
          </Card.Body>
        </Card>
      )}

      {/* 📅 Due Date */}
      <Form.Group className="mb-3">
        <Form.Label>Due Date</Form.Label>
        <Form.Control
          type="date"
          name="due_date"
          value={form.due_date}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* 🟡 Status */}
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

      {/* 📝 Notes */}
      <Form.Group className="mb-3">
        <Form.Label>Notes</Form.Label>
        <Form.Control
          as="textarea"
          rows={2}
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
      </Form.Group>

      <Button type="submit" variant="success" className="w-100">
        {invoice ? "Update Invoice" : "Add Invoice"}
      </Button>
    </Form>
  );
};

export default InvoiceForm;
