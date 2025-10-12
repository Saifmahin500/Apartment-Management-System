import React, { useEffect, useState } from "react";
import { Button, Table, Modal, Badge } from "react-bootstrap";
import api from "../../services/api";
import InvoiceForm from "./InvoiceForm";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [show, setShow] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);

  const fetchInvoices = async () => {
    const res = await api.get("/invoices");
    setInvoices(res.data);
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
                <Button size="sm" variant="primary" onClick={() => { setEditInvoice(inv); setShow(true); }}>Edit</Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleDelete(inv.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editInvoice ? "Edit Invoice" : "Add Invoice"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InvoiceForm invoice={editInvoice} onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default InvoiceList;
