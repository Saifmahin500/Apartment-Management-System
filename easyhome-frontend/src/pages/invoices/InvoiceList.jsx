import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Badge, Form } from "react-bootstrap";
import api from "../../services/api";
import InvoiceForm from "./InvoiceForm";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [show, setShow] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [filterMonth, setFilterMonth] = useState("");

  const fetchInvoices = async () => {
    const res = await api.get("/invoices");
    setInvoices(res.data);
  };

  // 🟢 নতুন filter ফাংশন যোগ করো
  const fetchFilteredInvoices = async () => {
    try {
      if (!filterMonth) {
        fetchInvoices();
        return;
      }
      const res = await api.get(`/invoices?month=${filterMonth}`);
      setInvoices(res.data);
    } catch (err) {
      console.error("Filter fetch error:", err);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/invoices/${id}`);
      fetchInvoices();
    }
  };

  const handleSuccess = () => {
    setShow(false);
    setEditInvoice(null);
    fetchInvoices();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Invoice Management</h4>
        <Button variant="success" onClick={() => setShow(true)}>
          + Add Invoice
        </Button>
      </div>

      <div className="d-flex gap-2 mb-3">
        <Form.Select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </Form.Select>

        <Button onClick={fetchFilteredInvoices}>Filter</Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
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
          {invoices.map((inv, i) => (
            <tr key={inv.id}>
              <td>{i + 1}</td>
              <td>{inv.invoice_number}</td>
              <td>{inv.flat?.name}</td>
              <td>{inv.tenant?.name}</td>
              <td>৳{parseFloat(inv.total_amount).toFixed(2)}</td>
              <td>{inv.due_date}</td>
              <td>
                <Badge bg={inv.status === "Paid" ? "success" : "warning"}>
                  {inv.status}
                </Badge>
              </td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => {
                    setEditInvoice(inv);
                    setShow(true);
                  }}
                >
                  Edit
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(inv.id)}
                >
                  Delete
                </Button>{" "}
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    window.open(
                      `http://localhost:8000/api/invoices/${inv.id}/pdf`,
                      "_blank"
                    )
                  }
                >
                  PDF
                </Button>{" "}
                <Button
                  size="sm"
                  variant="info"
                  onClick={() => api.post(`/invoices/${inv.id}/email`)}
                >
                  Email
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editInvoice ? "Edit Invoice" : "Add Invoice"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InvoiceForm invoice={editInvoice} onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InvoiceList;
