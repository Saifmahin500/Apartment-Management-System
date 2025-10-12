import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Button, Table, Modal } from "react-bootstrap";
import ExpenseForm from "./ExpenseForm";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [show, setShow] = useState(false);
  const [editExpense, setEditExpense] = useState(null);

  const fetchExpenses = async () => {
    const res = await api.get("/expenses");
    setExpenses(res.data);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  const handleSuccess = () => {
    setShow(false);
    setEditExpense(null);
    fetchExpenses();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Expense Management</h4>
        <Button variant="success" onClick={() => setShow(true)}>
          + Add Expense
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Category</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((e, i) => (
            <tr key={e.id}>
              <td>{i + 1}</td>
              <td>{e.category?.name}</td>
              <td>{e.title}</td>
              <td>৳{parseFloat(e.amount).toFixed(2)}</td>
              <td>{e.date}</td>
              <td>
                <Button size="sm" variant="primary" onClick={() => { setEditExpense(e); setShow(true); }}>Edit</Button>{" "}
                <Button size="sm" variant="danger" onClick={() => handleDelete(e.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editExpense ? "Edit Expense" : "Add Expense"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ExpenseForm expense={editExpense} onSuccess={handleSuccess} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ExpenseList;
