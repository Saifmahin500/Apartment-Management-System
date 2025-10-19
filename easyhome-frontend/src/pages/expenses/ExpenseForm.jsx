import React, { useEffect, useState } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import api from "../../services/api";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ExpenseForm = ({ expense, onSuccess }) => {
  const [form, setForm] = useState({
    category_id: "",
    title: "",
    amount: "",
    date: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/expense-categories");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    if (expense) {
      setForm(expense);
    }
  }, [expense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (expense) {
        await api.put(`/expenses/${expense.id}`, form);
      } else {
        await api.post("/expenses", form);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving expense:", error);
      alert("Failed to save expense. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" style={{ color: "#17A2B8" }} />
        <p className="text-muted mt-3">Loading categories...</p>
      </div>
    );
  }

  return (
    <Form onSubmit={handleSubmit}>
      <div className="row">
        {/* Category */}
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
              <i className="fas fa-tag me-2" style={{ color: "#6f42c1" }}></i>
              Category
            </Form.Label>
            <Form.Select
              name="category_id"
              value={form.category_id}
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
                e.target.style.borderColor = "#dc3545";
                e.target.style.boxShadow = "0 0 0 3px rgba(220,53,69,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            >
              <option value="">-- Select Category --</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>

        {/* Amount */}
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
              <i className="fas fa-money-bill me-2" style={{ color: "#dc3545" }}></i>
              Amount (৳)
            </Form.Label>
            <Form.Control
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="e.g., 5000"
              required
              step="0.01"
              min="0"
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#dc3545";
                e.target.style.boxShadow = "0 0 0 3px rgba(220,53,69,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* Title */}
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
              <i className="fas fa-file-alt me-2" style={{ color: "#fd7e14" }}></i>
              Title
            </Form.Label>
            <Form.Control
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Monthly Maintenance"
              required
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#dc3545";
                e.target.style.boxShadow = "0 0 0 3px rgba(220,53,69,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* Date */}
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
              <i className="fas fa-calendar me-2" style={{ color: "#20c997" }}></i>
              Date
            </Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={form.date}
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
                e.target.style.borderColor = "#dc3545";
                e.target.style.boxShadow = "0 0 0 3px rgba(220,53,69,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </Form.Group>
        </div>

        {/* Quick Amount Buttons */}
        <div className="col-md-6">
          <Form.Group className="mb-4">
            <Form.Label
              style={{
                fontWeight: "600",
                color: "#212529",
                fontSize: "14px",
                marginBottom: "10px",
              }}
            >
              Quick Amounts
            </Form.Label>
            <div className="d-flex gap-2">
              {[1000, 5000, 10000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className="btn btn-sm"
                  style={{
                    backgroundColor: "#f0f0f0",
                    color: "#495057",
                    border: "1px solid #e9ecef",
                    borderRadius: "6px",
                    fontWeight: "600",
                    fontSize: "12px",
                    padding: "8px 12px",
                    transition: "all 0.2s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#dc3545";
                    e.target.style.color = "white";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#f0f0f0";
                    e.target.style.color = "#495057";
                  }}
                  onClick={() => setForm({ ...form, amount })}
                >
                  ৳{amount.toLocaleString()}
                </button>
              ))}
            </div>
          </Form.Group>
        </div>

        {/* Description */}
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
              <i className="fas fa-notes-medical me-2" style={{ color: "#17A2B8" }}></i>
              Description (Optional)
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add notes or details about this expense..."
              style={{
                borderRadius: "8px",
                border: "2px solid #e9ecef",
                padding: "12px 14px",
                fontSize: "14px",
                transition: "all 0.3s",
                fontFamily: "inherit",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#dc3545";
                e.target.style.boxShadow = "0 0 0 3px rgba(220,53,69,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
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
            background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
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
              e.target.style.boxShadow = "0 6px 15px rgba(220,53,69,0.4)";
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
              <i className={`fas fa-${expense ? "save" : "plus"} me-2`}></i>
              {expense ? "Update Expense" : "Add Expense"}
            </>
          )}
        </button>
      </div>

      {/* Info Box */}
      {expense && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            border: "1px solid #f5c6cb",
            borderRadius: "8px",
            padding: "12px 14px",
            marginTop: "16px",
          }}
        >
          <p style={{ fontSize: "13px", color: "#721c24", marginBottom: "0" }}>
            <i className="fas fa-info-circle me-2"></i>
            You are editing an existing expense. Click "Update Expense" to save changes.
          </p>
        </div>
      )}
    </Form>
  );
};

export default ExpenseForm;