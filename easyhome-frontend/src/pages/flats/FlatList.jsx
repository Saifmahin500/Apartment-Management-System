import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Modal, Form, Spinner } from "react-bootstrap";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../app.css"; // ✅ CSS import

const FlatList = () => {
  const [flats, setFlats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
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
    setLoading(true);
    try {
      const res = await api.get("/flats");
      setFlats(res.data);
    } catch (err) {
      console.error("Error loading flats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlats();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      setForm({ ...form, images: files });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("building_id", 3);
    formData.append("flat_number", form.name);
    formData.append("name", form.name);
    formData.append("floor", form.floor);
    formData.append("rent_amount", form.rent_amount);
    formData.append("size", form.size);
    formData.append("status", form.status);
    if (form.images) {
      for (let i = 0; i < form.images.length; i++) {
        formData.append("images[]", form.images[i]);
      }
    }

    try {
      if (editingId) {
        await api.post(`/flats/${editingId}?_method=PUT`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/flats", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchFlats();
      handleCloseModal();
    } catch (err) {
      console.error("Error adding/updating flat:", err);
      const msg = err.response?.data?.message || "Failed to save flat!";
      alert("Error: " + msg);
    }
  };

  const handleEdit = (flat) => {
    setForm({
      name: flat.name,
      floor: flat.floor,
      rent_amount: flat.rent_amount,
      size: flat.size,
      status: flat.status,
      image: null,
    });
    setEditingId(flat.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this flat?")) {
      try {
        await api.delete(`/flats/${id}`);
        fetchFlats();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete flat!");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      name: "",
      floor: "",
      rent_amount: "",
      size: "",
      status: "available",
      image: null,
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center">
          <Spinner animation="border" style={{ color: "#17A2B8", width: "60px", height: "60px" }} />
          <p className="text-muted mt-3">Loading flats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid flat-container">
      {/* ===== Header ===== */}
      <div className="d-flex justify-content-between align-items-center mb-4 flat-header">
        <div>
          <h2>
            <i className="fas fa-building me-3 text-info"></i>Flat Management
          </h2>
          <p>Manage all your apartment flats and properties</p>
        </div>
        <button className="btn btn-add-flat" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus me-2"></i>Add New Flat
        </button>
      </div>

      {/* ===== Table Container ===== */}
      <div className="card flat-table-card">
        <div className="flat-table-header">
          <h5>
            <i className="fas fa-list me-2"></i>All Flats ({flats.length})
          </h5>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead>
              <tr>
                <th>#</th>
                <th>Flat Name</th>
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
                    <td>
                      <span className="flat-index-badge">{index + 1}</span>
                    </td>
                    <td>
                      <p>{flat.name}</p>
                    </td>
                    <td>
                      <span className="text-muted">
                        <i className="fas fa-layer-group me-2 text-warning"></i>
                        Floor {flat.floor}
                      </span>
                    </td>
                    <td>
                      <span className="fw-bold text-success">{flat.rent_amount}</span>
                    </td>
                    <td className="text-muted">{flat.size}</td>
                    <td>
                      <span
                        className={`flat-status ${
                          flat.status === "available" ? "available" : "occupied"
                        }`}
                      >
                        <i
                          className={`fas fa-${
                            flat.status === "available" ? "check-circle" : "times-circle"
                          } me-1`}
                        ></i>
                        {flat.status.charAt(0).toUpperCase() + flat.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      {flat.images && flat.images.length > 0 ? (
                        flat.images.slice(0, 2).map((img, i) => (
                          <img
                            key={i}
                            src={`http://localhost:8000/storage/${img.image}`}
                            alt="Flat"
                            width="40"
                            height="40"
                            className="flat-image me-2"
                          />
                        ))
                      ) : (
                        <span className="text-muted fst-italic">No image</span>
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button className="btn-edit" onClick={() => handleEdit(flat)}>
                          <i className="fas fa-edit me-1"></i>Edit
                        </button>
                        <button className="btn-delete" onClick={() => handleDelete(flat.id)}>
                          <i className="fas fa-trash me-1"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="flat-empty">
                    <i className="fas fa-inbox"></i>
                    <p>No flats found. Create your first flat!</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== Modal ===== */}
      <Modal show={showModal} onHide={handleCloseModal} centered size="lg" backdrop="static">
        <Modal.Header className="flat-modal-header" closeButton closeVariant="white">
          <Modal.Title className="flat-modal-title">
            <i className="fas fa-door-open me-2"></i>
            {editingId ? "Edit Flat" : "Add New Flat"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="flat-form-label">
                    <i className="fas fa-door-open me-2 text-info"></i>Flat Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g., Apt 101"
                    className="flat-form-control"
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="flat-form-label">
                    <i className="fas fa-layer-group me-2 text-warning"></i>Floor
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="floor"
                    value={form.floor}
                    onChange={handleChange}
                    placeholder="e.g., 1"
                    className="flat-form-control"
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="flat-form-label">
                    <i className="fas fa-money-bill me-2 text-success"></i>Rent Amount (৳)
                  </Form.Label>
                  <Form.Control
                    type="number"
                    name="rent_amount"
                    value={form.rent_amount}
                    onChange={handleChange}
                    placeholder="e.g., 10000"
                    className="flat-form-control"
                    required
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="flat-form-label">
                    <i className="fas fa-ruler me-2 text-purple"></i>Size (sqft)
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="size"
                    value={form.size}
                    onChange={handleChange}
                    placeholder="e.g., 800"
                    className="flat-form-control"
                  />
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="flat-form-label">
                    <i className="fas fa-circle me-2 text-info"></i>Status
                  </Form.Label>
                  <Form.Select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="flat-form-control"
                  >
                    <option value="available">Available</option>
                    <option value="occupied">Occupied</option>
                  </Form.Select>
                </Form.Group>
              </div>

              <div className="col-md-6">
                <Form.Group className="mb-4">
                  <Form.Label className="flat-form-label">
                    <i className="fas fa-image me-2 text-danger"></i>Upload Images
                  </Form.Label>
                  <Form.Control
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="flat-form-control"
                  />
                </Form.Group>
              </div>
            </div>

            <div className="d-flex gap-3 mt-4">
              <button type="submit" className="btn-save-flat flex-grow-1">
                <i className={`fas fa-${editingId ? "save" : "plus"} me-2`}></i>
                {editingId ? "Update" : "Add"} Flat
              </button>
              <button type="button" className="btn-cancel-flat flex-grow-1" onClick={handleCloseModal}>
                <i className="fas fa-times me-2"></i>Cancel
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default FlatList;
