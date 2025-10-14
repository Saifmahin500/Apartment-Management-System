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
    status: "Unpaid",
  });

  const [flats, setFlats] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);

  // 🟢 Fetch flats & tenants
  useEffect(() => {
    const fetchData = async () => {
      const flatsRes = await api.get("/flats/simple");
      setFlats(flatsRes.data);

      const tenantsRes = await api.get("/tenants");
      setTenants(tenantsRes.data);

      // invoice edit হলে form prefill
      if (invoice) {
        setForm({
          flat_id: invoice.flat_id || "",
          tenant_id: invoice.tenant_id || "",
          total_amount: invoice.total_amount || "",
          due_date: invoice.due_date || "",
          notes: invoice.notes || "",
          status: invoice.status || "Unpaid",
        });

        // flat অনুযায়ী tenant filter
        const flatTenants = tenantsRes.data.filter(
          (t) => t.flat_id === invoice.flat_id
        );
        setFilteredTenants(flatTenants);
      }
    };
    fetchData();
  }, [invoice]);

  // 🟣 Handle flat change
  const handleFlatChange = async (e) => {
    const selectedFlatId = e.target.value;
    setForm({ ...form, flat_id: selectedFlatId, tenant_id: "" });

    // ✅ Filter tenants based on selected flat
    const relatedTenants = tenants.filter((t) => t.flat_id == selectedFlatId);
    setFilteredTenants(relatedTenants);

    // ✅ Fetch rent info to auto-fill total & status
    try {
      const res = await api.get(`/rents?flat_id=${selectedFlatId}`);
      const rent = res.data[0];

      if (rent) {
        setForm((prev) => ({
          ...prev,
          total_amount:
            (rent.rent_amount || 0) +
            (rent.utility_amount || 0) +
            (rent.maintenance_charge || 0),
          status: rent.status === "Paid" ? "Paid" : "Unpaid",
        }));
      }
    } catch (err) {
      console.log("Rent fetch failed", err);
    }
  };

  // 🔵 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (invoice) await api.put(`/invoices/${invoice.id}`, form);
    else await api.post("/invoices", form);
    onSuccess();
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* Flat Select */}
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

      {/* Tenant Select */}
      <Form.Group className="mb-3">
        <Form.Label>Tenant</Form.Label>
        <Form.Select
          name="tenant_id"
          value={form.tenant_id}
          onChange={handleChange}
          required
          disabled={!filteredTenants.length}
        >
          <option value="">Select Tenant</option>
          {filteredTenants.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* Total Amount */}
      <Form.Group className="mb-3">
        <Form.Label>Total Amount</Form.Label>
        <Form.Control
          type="number"
          name="total_amount"
          value={form.total_amount}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* Due Date */}
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

      {/* Status */}
      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={form.status}
          onChange={handleChange}
          required
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </Form.Select>
      </Form.Group>

      {/* Notes */}
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
