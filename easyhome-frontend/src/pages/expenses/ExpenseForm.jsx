import React, { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import api from "../../services/api";

const ExpenseForm = ({ expense, onSuccess }) => {
  const [form, setForm] = useState({
    category_id: "",
    title: "",
    amount: "",
    date: "",
    description: "",
  });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get("/expense-categories").then((res) => setCategories(res.data));
    if (expense) setForm(expense);
  }, [expense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (expense) await api.put(`/expenses/${expense.id}`, form);
    else await api.post("/expenses", form);
    onSuccess();
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Category</Form.Label>
        <Form.Select name="category_id" value={form.category_id} onChange={handleChange} required>
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Title</Form.Label>
        <Form.Control name="title" value={form.title} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Amount</Form.Label>
        <Form.Control type="number" name="amount" value={form.amount} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Date</Form.Label>
        <Form.Control type="date" name="date" value={form.date} onChange={handleChange} required />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Description</Form.Label>
        <Form.Control as="textarea" rows={2} name="description" value={form.description} onChange={handleChange} />
      </Form.Group>

      <Button type="submit" variant="success" className="w-100">
        {expense ? "Update Expense" : "Add Expense"}
      </Button>
    </Form>
  );
};

export default ExpenseForm;
