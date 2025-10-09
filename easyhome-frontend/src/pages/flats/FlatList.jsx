import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Modal, Button, Table, Form } from "react-bootstrap";

const FlatList = () => {
  const [flats, setFlats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    floor: "",
    rent_amount: "",
    size: "",
    status: "available",
    image: null,
  });
  const [editingId, setEditingId] = useState(null);

  // 🧠 Load flats
  const fetchFlats = async () => {
    const res = await api.get("/api/flats");
    setFlats(res.data);
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    if (editingId) {
      await api.post(`/api/flats/${editingId}?_method=PUT`, formData);
    } else {
      await api.post("/api/flats", formData);
    }
    setShowModal(false);
    setEditingId(null);
    fetchFlats();
  };

  const handleEdit = (flat) => {
    setForm(flat);
    setEditingId(flat.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await api.delete(`/api/flats/${id}`);
      fetchFlats();
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🏠 Flat Management</h3>
        <Button variant="success" onClick={() => setShowModal(true)}>
          + Add Flat
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Floor</th>
            <th>Rent</th>
            <th>Size</th>
            <th>Status</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {flats.map((flat, index) => (
            <tr key={flat.id}>
              <td>{index + 1}</td>
              <td>{flat.name}</td>
              <td>{flat.floor}</td>
              <td>{flat.rent_amount}৳</td>
              <td>{flat.size}</td>
              <td
                className={
                  flat.status === "available" ? "text-success" : "text-danger"
                }
              >
                {flat.status}
              </td>
              <td>
                {flat.image ? (
                  <img
                    src={`http://localhost:8000/storage/${flat.image}`}
                    alt="Flat"
                    width="70"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="primary"
                  className="me-2"
                  onClick={() => handleEdit(flat)}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(flat.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingId ? "Edit Flat" : "Add Flat"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Floor</Form.Label>
              <Form.Control
                type="number"
                name="floor"
                value={form.floor}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Rent Amount</Form.Label>
              <Form.Control
                type="number"
                name="rent_amount"
                value={form.rent_amount}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Size</Form.Label>
              <Form.Control
                type="text"
                name="size"
                value={form.size}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              {editingId ? "Update" : "Add"} Flat
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FlatList;
