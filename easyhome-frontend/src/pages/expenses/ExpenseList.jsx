import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Button, Modal, Spinner } from "react-bootstrap";
import ExpenseForm from "./ExpenseForm";
import "@fortawesome/fontawesome-free/css/all.min.css";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [show, setShow] = useState(false);
  const [editExpense, setEditExpense] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data || []);
    } catch (err) {
      console.error("Error fetching expenses:", err);
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  const handleSuccess = () => {
    setShow(false);
    setEditExpense(null);
    fetchExpenses();
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setShow(true);
  };

  const handleAdd = () => {
    setEditExpense(null);
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setEditExpense(null);
  };

  // Calculate totals
  const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  
  // Group by category
  const expensesByCategory = expenses.reduce((acc, e) => {
    const category = e.category?.name || "Other";
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += parseFloat(e.amount) || 0;
    return acc;
  }, {});

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ backgroundColor: "#f8f9fa" }}
      >
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#17A2B8", width: "60px", height: "60px" }} />
          <p className="text-muted mt-3">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      {/* ===== Header ===== */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="fw-bold mb-2" style={{ color: "#212529", fontSize: "32px" }}>
              <i className="fas fa-receipt me-3" style={{ color: "#17A2B8" }}></i>
              Expense Management
            </h2>
            <p className="text-muted" style={{ marginLeft: "55px", fontSize: "15px" }}>
              Track and manage all your property expenses
            </p>
          </div>
          <button
            className="btn text-white fw-semibold px-4 py-2"
            style={{
              background: "linear-gradient(135deg, #17A2B8 0%, #20c997 100%)",
              border: "none",
              borderRadius: "10px",
              fontSize: "15px",
              transition: "all 0.3s",
            }}
            onClick={handleAdd}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px)";
              e.target.style.boxShadow = "0 6px 15px rgba(23,162,184,0.4)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            <i className="fas fa-plus me-2"></i>Add New Expense
          </button>
        </div>
      </div>

      {/* ===== Summary Card ===== */}
      <div className="row mb-5">
        <div className="col-12">
          <div
            className="card border-0"
            style={{
              borderRadius: "14px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
              borderLeft: "6px solid #dc3545",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 15px rgba(0,0,0,0.08)";
            }}
          >
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-8">
                  <p className="text-muted small mb-2" style={{ fontSize: "13px", fontWeight: "600" }}>
                    Total Expenses
                  </p>
                  <h3 className="fw-bold mb-3" style={{ color: "#dc3545", fontSize: "32px" }}>
                    ৳ {totalExpenses.toLocaleString()}
                  </h3>
                  <div className="row">
                    {Object.entries(expensesByCategory).map(([category, amount]) => (
                      <div key={category} className="col-md-3 mb-2">
                        <small style={{ color: "#6c757d", fontWeight: "500" }}>
                          <i className="fas fa-tag me-1" style={{ color: "#fd7e14" }}></i>
                          {category}: <strong>৳ {amount.toLocaleString()}</strong>
                        </small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="col-md-4 text-center">
                  <div
                    style={{
                      width: "80px",
                      height: "80px",
                      borderRadius: "12px",
                      backgroundColor: "#f8d7da",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto",
                    }}
                  >
                    <i className="fas fa-credit-card" style={{ fontSize: "36px", color: "#dc3545" }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Main Table Container ===== */}
      <div
        className="card border-0"
        style={{
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Table Header */}
        <div
          className="px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
            color: "white",
          }}
        >
          <h5 className="fw-bold mb-0" style={{ fontSize: "18px" }}>
            <i className="fas fa-list me-2"></i>
            Expense Records ({expenses.length})
          </h5>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #e9ecef" }}>
              <tr>
                <th className="px-4 py-4" style={{ color: "#6c757d", fontWeight: "600", fontSize: "14px" }}>
                  <i className="fas fa-hashtag me-2"></i>#
                </th>
                <th className="px-4 py-4" style={{ color: "#6c757d", fontWeight: "600", fontSize: "14px" }}>
                  <i className="fas fa-tag me-2"></i>Category
                </th>
                <th className="px-4 py-4" style={{ color: "#6c757d", fontWeight: "600", fontSize: "14px" }}>
                  <i className="fas fa-file-alt me-2"></i>Title
                </th>
                <th className="px-4 py-4" style={{ color: "#6c757d", fontWeight: "600", fontSize: "14px" }}>
                  <i className="fas fa-money-bill me-2"></i>Amount
                </th>
                <th className="px-4 py-4" style={{ color: "#6c757d", fontWeight: "600", fontSize: "14px" }}>
                  <i className="fas fa-calendar me-2"></i>Date
                </th>
                <th className="px-4 py-4" style={{ color: "#6c757d", fontWeight: "600", fontSize: "14px" }}>
                  <i className="fas fa-cogs me-2"></i>Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    <i
                      className="fas fa-inbox"
                      style={{
                        fontSize: "40px",
                        color: "#ccc",
                        marginBottom: "16px",
                      }}
                    ></i>
                    <p style={{ color: "#6c757d", fontSize: "15px" }}>
                      No expenses found. Add your first expense!
                    </p>
                  </td>
                </tr>
              ) : (
                expenses.map((e, i) => (
                  <tr
                    key={e.id}
                    style={{
                      borderBottom: "1px solid #e9ecef",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#ffe8e8";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <td className="px-4 py-4">
                      <span
                        style={{
                          backgroundColor: "#f8d7da",
                          color: "#dc3545",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "13px",
                        }}
                      >
                        {i + 1}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        style={{
                          backgroundColor: "#e7d4f5",
                          color: "#6f42c1",
                          padding: "6px 12px",
                          borderRadius: "6px",
                          fontWeight: "600",
                          fontSize: "13px",
                          display: "inline-block",
                        }}
                      >
                        {e.category?.name || "Other"}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div style={{ fontWeight: "600", color: "#212529", fontSize: "15px" }}>
                        {e.title}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div style={{ fontWeight: "700", color: "#dc3545", fontSize: "15px" }}>
                        ৳ {parseFloat(e.amount).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div style={{ color: "#6c757d", fontSize: "14px" }}>
                        <i className="fas fa-calendar me-2" style={{ color: "#fd7e14" }}></i>
                        {new Date(e.date).toLocaleDateString("en-GB")}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "12px",
                            padding: "6px 12px",
                            transition: "all 0.2s",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#1976d2";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#e3f2fd";
                            e.target.style.color = "#1976d2";
                          }}
                          onClick={() => handleEdit(e)}
                        >
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{
                            backgroundColor: "#ffebee",
                            color: "#dc3545",
                            border: "none",
                            borderRadius: "6px",
                            fontWeight: "600",
                            fontSize: "12px",
                            padding: "6px 12px",
                            transition: "all 0.2s",
                            cursor: "pointer",
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.backgroundColor = "#dc3545";
                            e.target.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.backgroundColor = "#ffebee";
                            e.target.style.color = "#dc3545";
                          }}
                          onClick={() => handleDelete(e.id)}
                        >
                          <i className="fas fa-trash me-1"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal ===== */}
      <Modal
        show={show}
        onHide={handleCloseModal}
        centered
        size="lg"
        backdrop="static"
      >
        <Modal.Header
          style={{
            background: "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
            color: "white",
            borderBottom: "none",
          }}
          closeButton
          closeVariant="white"
        >
          <Modal.Title className="fw-bold" style={{ fontSize: "20px" }}>
            <i className="fas fa-receipt me-2"></i>
            {editExpense ? "Edit Expense" : "Add New Expense"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <ExpenseForm expense={editExpense} onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExpenseList;