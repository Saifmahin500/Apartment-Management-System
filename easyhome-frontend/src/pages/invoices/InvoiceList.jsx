import React, { useEffect, useState } from "react";
import { Modal, Badge, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../services/api";
import InvoiceForm from "./InvoiceForm";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../app.css"; 

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [show, setShow] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [loading, setLoading] = useState(false);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  const showSuccess = (msg) => Toast.fire({ icon: "success", title: msg });
  const showError = (msg) =>
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: msg || "Something went wrong!",
    });

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/invoices");
      setInvoices(res.data || []);
    } catch (err) {
      showError("Failed to fetch invoices.");
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This invoice will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/invoices/${id}`);
        fetchInvoices();
        showSuccess("Invoice deleted successfully!");
      } catch {
        showError("Failed to delete invoice.");
      }
    }
  };

  const handleSuccess = () => {
    setShow(false);
    setEditInvoice(null);
    fetchInvoices();
    showSuccess(editInvoice ? "Invoice updated successfully!" : "Invoice added successfully!");
  };

  const handleSendEmail = async (id) => {
    Swal.fire({
      title: "Sending invoice...",
      text: "Please wait while we send the invoice email.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await api.post(`/invoices/${id}/email`);
      Swal.close();
      Swal.fire({
        icon: "success",
        title: "Email Sent!",
        text: res.data.message || "Invoice email sent successfully!",
        showConfirmButton: false,
        timer: 2000,
      });
      fetchInvoices();
    } catch (err) {
      Swal.close();
      showError(err.response?.data?.message || "Failed to send invoice email.");
    }
  };

  const totalAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
  const paidAmount = invoices.filter((inv) => inv.status === "Paid").reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
  const pendingAmount = invoices.filter((inv) => inv.status !== "Paid").reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);

  if (loading && invoices.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#17A2B8", width: "60px", height: "60px" }} />
          <p className="text-muted mt-3">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid invoice-container">
      {/* ===== Header ===== */}
      <div className="invoice-header mb-4 d-flex justify-content-between align-items-center">
        <div>
          <h2>
            <i className="fas fa-file-invoice-dollar me-3 text-info"></i>Invoice Management
          </h2>
          <p>Create, manage and send invoices to tenants</p>
        </div>
        <button className="btn btn-add-invoice" onClick={() => setShow(true)}>
          <i className="fas fa-plus me-2"></i>Add New Invoice
        </button>
      </div>

      {/* ===== Summary Cards ===== */}
      <div className="row g-3 mb-5">
        <div className="col-md-4">
          <div className="card invoice-summary-card border-left-info">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted small fw-semibold mb-2">Total Invoiced</p>
                  <h4 className="fw-bold text-info">৳ {totalAmount.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#e0f7fa" }}>
                  <i className="fas fa-file-invoice text-info fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card invoice-summary-card border-left-success">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted small fw-semibold mb-2">Amount Paid</p>
                  <h4 className="fw-bold text-success">৳ {paidAmount.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#e8f5e9" }}>
                  <i className="fas fa-check-circle text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card invoice-summary-card border-left-warning">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div>
                  <p className="text-muted small fw-semibold mb-2">Pending Amount</p>
                  <h4 className="fw-bold text-warning">৳ {pendingAmount.toLocaleString()}</h4>
                </div>
                <div className="icon-box" style={{ backgroundColor: "#fff3cd" }}>
                  <i className="fas fa-clock text-warning fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Table ===== */}
      <div className="card invoice-table">
        <div className="invoice-table-header">
          <h5>
            <i className="fas fa-list me-2"></i>All Invoices ({invoices.length})
          </h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Invoice No</th>
                <th>Flat</th>
                <th>Tenant</th>
                <th>Total</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="8" className="invoice-empty">
                    <i className="fas fa-inbox"></i>
                    <p>No invoices found. Create your first invoice!</p>
                  </td>
                </tr>
              ) : (
                invoices.map((inv, i) => (
                  <tr key={inv.id}>
                    <td><span className="invoice-index">{i + 1}</span></td>
                    <td><strong>{inv.invoice_number}</strong></td>
                    <td className="text-muted">{inv.flat?.name}</td>
                    <td className="text-muted">{inv.tenant?.name}</td>
                    <td className="invoice-amount">৳ {parseFloat(inv.total_amount).toLocaleString()}</td>
                    <td className="invoice-date">{new Date(inv.due_date).toLocaleDateString("en-GB")}</td>
                    <td>
                      <span
                        className={`invoice-status ${
                          inv.status === "Paid"
                            ? "status-paid"
                            : inv.status === "Sent"
                            ? "status-sent"
                            : "status-pending"
                        }`}
                      >
                        <i
                          className={`fas fa-${
                            inv.status === "Paid"
                              ? "check-circle"
                              : inv.status === "Sent"
                              ? "paper-plane"
                              : "clock"
                          } me-1`}
                        ></i>
                        {inv.status}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <button className="btn-invoice-edit" onClick={() => { setEditInvoice(inv); setShow(true); }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-invoice-view" onClick={() => { setSelectedInvoiceId(inv.id); setShowPdfModal(true); }}>
                          <i className="fas fa-file-pdf"></i>
                        </button>
                        <button className="btn-invoice-mail" onClick={() => handleSendEmail(inv.id)}>
                          <i className="fas fa-envelope"></i>
                        </button>
                        <button className="btn-invoice-delete" onClick={() => handleDelete(inv.id)}>
                          <i className="fas fa-trash"></i>
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

      {/* ===== Add/Edit Modal ===== */}
      <Modal show={show} onHide={() => setShow(false)} centered size="lg" backdrop="static">
        <Modal.Header className="invoice-modal-header" closeButton closeVariant="white">
          <Modal.Title className="invoice-modal-title">
            <i className="fas fa-file-invoice me-2"></i>
            {editInvoice ? "Edit Invoice" : "Add New Invoice"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          <InvoiceForm invoice={editInvoice} onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>

      {/* ===== PDF Preview Modal ===== */}
      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} size="xl" centered>
        <Modal.Header className="invoice-pdf-modal-header" closeButton closeVariant="white">
          <Modal.Title className="fw-bold">
            <i className="fas fa-file-pdf me-2"></i>Invoice PDF Preview
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedInvoiceId ? (
            <iframe
              src={`http://localhost:8000/api/invoices/${selectedInvoiceId}/pdf`}
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="Invoice PDF"
            ></iframe>
          ) : (
            <div className="text-center py-4">
              <Spinner animation="border" style={{ color: "#17A2B8" }} />
              <p className="text-muted mt-3">Loading PDF...</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InvoiceList;
