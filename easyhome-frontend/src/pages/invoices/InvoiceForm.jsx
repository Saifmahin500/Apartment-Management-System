import React, { useState, useEffect } from "react";
import { Form, Spinner } from "react-bootstrap";
import api from "../../services/api";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../app.css"; // ✅ make sure global css imported

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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const flatsRes = await api.get("/flats/simple");
        setFlats(flatsRes.data || []);

        const tenantsRes = await api.get("/tenants");
        setTenants(tenantsRes.data || []);

        if (invoice) {
          setForm({
            flat_id: invoice.flat_id || "",
            tenant_id: invoice.tenant_id || "",
            total_amount: invoice.total_amount || "",
            due_date: invoice.due_date || "",
            notes: invoice.notes || "",
            status: invoice.status || "Unpaid",
          });

          const flatTenants = (tenantsRes.data || []).filter(
            (t) => t.flat_id === invoice.flat_id
          );
          setFilteredTenants(flatTenants);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [invoice]);

  const handleFlatChange = async (e) => {
    const selectedFlatId = e.target.value;
    setForm({ ...form, flat_id: selectedFlatId, tenant_id: "" });

    const relatedTenants = tenants.filter((t) => t.flat_id == selectedFlatId);
    setFilteredTenants(relatedTenants);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (invoice) {
        await api.put(`/invoices/${invoice.id}`, form);
      } else {
        await api.post("/invoices", form);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert("Failed to save invoice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" style={{ color: "#17A2B8" }} />
        <p className="text-muted mt-3">Loading data...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className="invoice-form">
      <div className="row">
        {/* Flat Select */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="fas fa-door-open text-info"></i> Select Flat
            </Form.Label>
            <Form.Select
              name="flat_id"
              value={form.flat_id}
              onChange={handleFlatChange}
              required
            >
              <option value="">-- Select Flat --</option>
              {flats.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} - ৳ {f.rent_amount}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* Tenant Select */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="fas fa-user text-success"></i> Select Tenant
            </Form.Label>
            <Form.Select
              name="tenant_id"
              value={form.tenant_id}
              onChange={handleChange}
              required
              disabled={!filteredTenants.length}
              className={!filteredTenants.length ? "disabled-select" : ""}
            >
              <option value="">-- Select Tenant --</option>
              {filteredTenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Form.Select>
            {!filteredTenants.length && form.flat_id && (
              <small className="d-block mt-2">
                <i className="fas fa-info-circle me-1"></i>
                No tenants available for this flat
              </small>
            )}
          </Form.Group>
        </div>

        {/* Total Amount */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="fas fa-money-bill text-danger"></i> Total Amount (৳)
            </Form.Label>
            <Form.Control
              type="number"
              name="total_amount"
              value={form.total_amount}
              onChange={handleChange}
              placeholder="e.g., 15000"
              required
              step="0.01"
              min="0"
            />
            <small className="d-block mt-2">
              <i className="fas fa-lightbulb text-warning me-1"></i>
              Auto-filled from selected flat rent information
            </small>
          </Form.Group>
        </div>

        {/* Due Date */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="fas fa-calendar text-orange"></i> Due Date
            </Form.Label>
            <Form.Control
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </div>

        {/* Status */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="fas fa-circle text-purple"></i> Status
            </Form.Label>
            <Form.Select
              name="status"
              value={form.status}
              onChange={handleChange}
              required
            >
              <option value="Unpaid">Unpaid</option>
              <option value="Paid">Paid</option>
              <option value="Sent">Sent</option>
            </Form.Select>
          </Form.Group>
        </div>

        {/* Notes */}
        <div className="col-12">
          <Form.Group className="mb-4">
            <Form.Label>
              <i className="fas fa-notes-medical text-info"></i> Notes (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add additional notes or payment terms..."
            />
          </Form.Group>
        </div>
      </div>

      {/* Submit Button */}
      <div className="d-flex gap-3 mt-4">
        <button type="submit" disabled={submitting} className="btn-submit">
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <i className={`fas fa-${invoice ? "save" : "plus"} me-2`}></i>
              {invoice ? "Update Invoice" : "Create Invoice"}
            </>
          )}
        </button>
      </div>

      {/* Info Messages */}
      {invoice && (
        <div className="info-box mt-3">
          <p>
            <i className="fas fa-info-circle me-2"></i>
            You are editing an existing invoice. Click "Update Invoice" to save changes.
          </p>
        </div>
      )}

      {form.flat_id && (
        <div className="auto-box mt-3">
          <p>
            <i className="fas fa-magic me-2"></i>
            Total amount is auto-populated from the selected flat's rent information.
          </p>
        </div>
      )}
    </Form>
  );
};

export default InvoiceForm;
