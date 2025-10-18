import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { Form, Button, Spinner } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";

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
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchFlats = async () => {
      setLoading(true);
      try {
        const res = await api.get("/flats/simple");
        setFlats(res.data || []);
      } catch (error) {
        console.error("Error fetching flats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFlats();

    if (tenant) setForm(tenant);
  }, [tenant]);

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (tenant) {
        await api.put(`/tenants/${tenant.id}`, form);
      } else {
        await api.post("/tenants", form);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving tenant:", error);
      alert("Failed to save tenant. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" style={{ color: "#17A2B8" }} />
        <p className="text-muted mt-3">Loading flats...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="row">
        {/* Name */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-user me-2" style={{ color: "#17A2B8" }}></i>
              Full Name
            </Form.Label>
            <Form.Control
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., John Doe"
              required
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#17A2B8";
                e.target.style.boxShadow = "0 0 0 3px rgba(23,162,184,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* Email */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-envelope me-2" style={{ color: "#20c997" }}></i>
              Email Address
            </Form.Label>
            <Form.Control
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="e.g., john@example.com"
              required
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#17A2B8";
                e.target.style.boxShadow = "0 0 0 3px rgba(23,162,184,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* Phone */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-phone me-2" style={{ color: "#fd7e14" }}></i>
              Phone Number
            </Form.Label>
            <Form.Control
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g., +880123456789"
              required
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#17A2B8";
                e.target.style.boxShadow = "0 0 0 3px rgba(23,162,184,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* Flat Selection */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-door-open me-2" style={{ color: "#dc3545" }}></i>
              Select Flat
            </Form.Label>
            <Form.Select
              name="flat_id"
              value={form.flat_id}
              onChange={handleChange}
              required
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#17A2B8";
                e.target.style.boxShadow = "0 0 0 3px rgba(23,162,184,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">-- Select a Flat --</option>
              {flats.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} - ৳ {f.rent_amount}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* Start Date */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-calendar-check me-2" style={{ color: "#20c997" }}></i>
              Start Date
            </Form.Label>
            <Form.Control
              name="start_date"
              type="date"
              value={form.start_date}
              onChange={handleChange}
              required
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#17A2B8";
                e.target.style.boxShadow = "0 0 0 3px rgba(23,162,184,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* End Date */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-calendar-times me-2" style={{ color: "#fd7e14" }}></i>
              End Date (Optional)
            </Form.Label>
            <Form.Control
              name="end_date"
              type="date"
              value={form.end_date}
              onChange={handleChange}
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#17A2B8";
                e.target.style.boxShadow = "0 0 0 3px rgba(23,162,184,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* Monthly Rent */}
        <div className="col-12">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <i className="fas fa-money-bill me-2" style={{ color: "#6f42c1" }}></i>
              Monthly Rent (৳)
            </Form.Label>
            <Form.Control
              name="monthly_rent"
              type="number"
              value={form.monthly_rent}
              onChange={handleChange}
              placeholder="Automatically filled from selected flat"
              required
              readOnly
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                backgroundColor: "#f8f9fa",
                color: "#495057",
                cursor: "not-allowed",
              }}
            />
            <small className="text-muted d-block mt-2" style={{ fontSize: "12px" }}>
              <i className="fas fa-info-circle me-1"></i>
              This field is automatically populated based on the selected flat
            </small>
          </Form.Group>
        </div>
      </div>

      {/* Buttons */}
      <div className="d-flex gap-3 mt-5">
        <button
          type="submit"
          disabled={submitting}
          className="btn flex-grow-1 fw-semibold py-3"
          style={{
            background: "linear-gradient(135deg, #17A2B8 0%, #20c997 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            fontSize: "15px",
            transition: "all 0.3s",
            opacity: submitting ? 0.7 : 1,
          }}
          onMouseEnter={(e) => {
            if (!submitting) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 6px 15px rgba(23,162,184,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          {submitting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Saving...
            </>
          ) : (
            <>
              <i className={`fas fa-${tenant ? "save" : "plus"} me-2`}></i>
              {tenant ? "Update Tenant" : "Add Tenant"}
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      {tenant && (
        <div
          style={{
            backgroundColor: "#e3f2fd",
            border: "1px solid #90caf9",
            borderRadius: "8px",
            padding: "12px 14px",
            marginTop: "16px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#1565c0", marginBottom: "0" }}>
            <i className="fas fa-info-circle me-2"></i>
            You are editing an existing tenant. Click "Update Tenant" to save changes.
          </p>
        </div>
      )}
    </Form>
  );
};

export default TenantForm;