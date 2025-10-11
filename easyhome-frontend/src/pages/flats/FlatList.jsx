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
    try {
      const res = await api.get("/api/flats");
      setFlats(res.data);
    } catch (err) {
      console.error("Error loading flats:", err);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm({ ...form, images: files }); // ✅ multiple file set
    } else {
      setForm({ ...form, [name]: value });
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("building_id", 3); // ✅ test value
    formData.append("flat_number", form.name); // optional placeholder
    formData.append("name", form.name);
    formData.append("floor", form.floor);
    formData.append("rent_amount", form.rent_amount); // ✅ ঠিক নাম ব্যবহার
    formData.append("size", form.size);
    formData.append("status", form.status);
    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images[]", form.images[i]);
      }
    }
    

    try {
      if (editingId) {
        await api.post(`/api/flats/${editingId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Flat updated successfully!");
      } else {
        await api.post("/api/flats", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("✅ Flat added successfully!");
      }

      fetchFlats();
      setShowModal(false);
      setForm({
        name: "",
        floor: "",
        rent_amount: "",
        size: "",
        status: "available",
        image: null,
      });
      setEditingId(null);
    } catch (err) {
      console.error("❌ Error adding/updating flat:", err);
      const msg = err.response?.data?.message || "Failed to save flat!";
      alert("❌ " + msg);
    }
    
  };

  const handleEdit = (flat) => {
    setForm({
      name: flat.name,
      floor: flat.floor,
      rent_amount: flat.rent_amount,
      size: flat.size,
      status: flat.status,
      image: null, // নতুন ফাইল সিলেক্ট করলে সেট হবে
    });
    setEditingId(flat.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this flat?")) {
      try {
        await api.delete(`/api/flats/${id}`);
        fetchFlats();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete flat!");
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>🏢 Flat Management</h3>
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
          {flats.length > 0 ? (
            flats.map((flat, index) => (
              <tr key={flat.id}>
                <td>{index + 1}</td>
                <td>{flat.name}</td>
                <td>{flat.floor}</td>
                <td>{flat.rent_amount}৳</td>
                <td>{flat.size}</td>
                <td
                  className={
                    flat.status === "available"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }
                >
                  {flat.status}
                </td>
                <td>
  {flat.images && flat.images.length > 0 ? (
    flat.images.map((img, i) => (
      <img
        key={i}
        src={`http://localhost:8000/storage/${img.image}`}
        alt="Flat"
        width="50"
        className="rounded me-1"
      />
    ))
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
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">
                No flats found
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* 🧩 Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Flat" : "Add Flat"}</Modal.Title>
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
  <Form.Label>Images</Form.Label>
  <Form.Control
    type="file"
    name="images"
    multiple  // ✅ allow multiple
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
