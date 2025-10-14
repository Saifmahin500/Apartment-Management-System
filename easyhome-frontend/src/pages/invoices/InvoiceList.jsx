import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Badge, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import api from "../../services/api";
import InvoiceForm from "./InvoiceForm";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [show, setShow] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);

  // ✅ SweetAlert Toast
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2500,
    timerProgressBar: true,
  });

  const showSuccess = (msg) => Toast.fire({ icon: "success", title: msg });
  const showError = (msg) =>
    Swal.fire({ icon: "error", title: "Oops...", text: msg || "Something went wrong!" });

  // ✅ Fetch all invoices
  const fetchInvoices = async () => {
    try {
      const res = await api.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      showError("Failed to fetch invoices.");
    }
  };

  // ✅ Filter invoices by month
  const fetchFilteredInvoices = async () => {
    try {
      if (!filterMonth) return fetchInvoices();
      const res = await api.get(`/invoices?month=${filterMonth}`);
      setInvoices(res.data);
    } catch {
      showError("Failed to filter invoices.");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // ✅ Delete invoice
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This invoice will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
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

  // ✅ On add/edit success
  const handleSuccess = () => {
    setShow(false);
    setEditInvoice(null);
    fetchInvoices();
    showSuccess(editInvoice ? "Invoice updated successfully!" : "Invoice added successfully!");
  };

  // ✅ Send Email
  const handleSendEmail = async (id) => {
    try {
      await api.post(`/invoices/${id}/email`);
      showSuccess("Invoice email sent successfully!");
    } catch (err) {
      showError("Failed to send invoice email.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Invoice Management</h4>
        <Button variant="success" onClick={() => setShow(true)}>
          + Add Invoice
        </Button>
      </div>

      {/* 🔍 Filter Section */}
      <div className="d-flex gap-2 mb-3">
        <Form.Select value={filterMonth} onChange={(e) => setFilterMonth(e.target.value)}>
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </Form.Select>
        <Button onClick={fetchFilteredInvoices}>Filter</Button>
      </div>

      {/* 🧾 Invoice Table */}
      <Table bordered hover responsive>
        <thead>
          <tr className="text-center align-middle">
            <th>#</th>
            <th>Invoice No</th>
            <th>Flat</th>
            <th>Tenant</th>
            <th>Total</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((inv, i) => (
              <tr key={inv.id} className="text-center align-middle">
                <td>{i + 1}</td>
                <td>{inv.invoice_number}</td>
                <td>{inv.flat?.name}</td>
                <td>{inv.tenant?.name}</td>
                <td>৳{parseFloat(inv.total_amount).toFixed(2)}</td>
                <td>{inv.due_date}</td>
                <td>
                  <Badge bg={inv.status === "Paid" ? "success" : "warning"}>{inv.status}</Badge>
                </td>
                <td>
                  <Button size="sm" variant="primary" onClick={() => { setEditInvoice(inv); setShow(true); }}>
                    Edit
                  </Button>{" "}
                  <Button size="sm" variant="danger" onClick={() => handleDelete(inv.id)}>
                    Delete
                  </Button>{" "}
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => { setSelectedInvoiceId(inv.id); setShowPdfModal(true); }}
                  >
                    Invoice
                  </Button>{" "}
                  <Button size="sm" variant="info" onClick={() => handleSendEmail(inv.id)}>
                    Email
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center py-4">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🔧 Add/Edit Modal */}
      <Modal show={show} onHide={() => setShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editInvoice ? "Edit Invoice" : "Add Invoice"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InvoiceForm invoice={editInvoice} onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>

      {/* 🧾 PDF Preview Modal */}
      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedInvoiceId ? (
            <iframe
              src={`http://localhost:8000/api/invoices/${selectedInvoiceId}/pdf`}
              width="100%"
              height="600px"
              style={{ border: "none" }}
              title="Invoice PDF"
            ></iframe>
          ) : (
            <p>Loading PDF...</p>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InvoiceList;
