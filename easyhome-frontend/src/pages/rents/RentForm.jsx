import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import api from "../../services/api";

const RentForm = ({ rent, onSuccess }) => {
  const [form, setForm] = useState({
    flat_id: "",
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear(),
    rent_amount: "",
    utility_amount: "",
    maintenance_charge: "",
    total_amount: "",
    due_amount: "",
    status: "Due",
  });

  const [flats, setFlats] = useState([]);

  // 🧠 Fetch Flats
  useEffect(() => {
    api
      .get("/flats/simple")
      .then((res) => setFlats(res.data || []))
      .catch((err) => console.error("Error loading flats:", err));
  }, []);

  // ✅ যখন rent prop আসে (Edit করার সময়)
  useEffect(() => {
    if (rent) {
      setForm({
        flat_id: rent.flat_id || "",
        month: rent.month || "",
        year: rent.year || new Date().getFullYear(),
        rent_amount: rent.rent_amount || "",
        utility_amount: rent.utility_amount || "",
        maintenance_charge: rent.maintenance_charge || "",
        total_amount: rent.total_amount || "",
        due_amount: rent.due_amount || "",
        status: rent.status || "Due",
      });
    }
  }, [rent]);

  // 🧮 Auto Total Calculation
  useEffect(() => {
    const total =
      (parseFloat(form.rent_amount) || 0) +
      (parseFloat(form.utility_amount) || 0) +
      (parseFloat(form.maintenance_charge) || 0);
    setForm((prev) => ({ ...prev, total_amount: total }));
  }, [form.rent_amount, form.utility_amount, form.maintenance_charge]);

  // ✏️ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "flat_id") {
      const selectedFlat = flats.find((flat) => flat.id == value);
      setForm({
        ...form,
        flat_id: value,
        rent_amount: selectedFlat ? selectedFlat.rent_amount : "",
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // 💾 Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (rent) {
        res = await api.put(`/rents/${rent.id}`, form);
      } else {
        res = await api.post("/rents", form);
      }
      onSuccess(res.data); // ✅ updated rent send to parent
    } catch (error) {
      console.error("Error saving rent:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {/* 🏢 Flat */}
      <Form.Group className="mb-3">
        <Form.Label>Flat</Form.Label>
        <Form.Select
          name="flat_id"
          value={form.flat_id}
          onChange={handleChange}
          required
        >
          <option value="">Select Flat</option>
          {flats.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* 🗓 Month */}
      <Form.Group className="mb-3">
        <Form.Label>Month</Form.Label>
        <Form.Select
          name="month"
          value={form.month}
          onChange={handleChange}
          required
        >
          <option value="">Select Month</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* 📅 Year */}
      <Form.Group className="mb-3">
        <Form.Label>Year</Form.Label>
        <Form.Control
          name="year"
          type="number"
          value={form.year}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* 💰 Rent Amount */}
      <Form.Group className="mb-3">
        <Form.Label>Rent Amount</Form.Label>
        <Form.Control
          name="rent_amount"
          type="number"
          value={form.rent_amount}
          onChange={handleChange}
          required
        />
      </Form.Group>

      {/* 💡 Utility Charge */}
      <Form.Group className="mb-3">
        <Form.Label>Utility Charge</Form.Label>
        <Form.Control
          name="utility_amount"
          type="number"
          value={form.utility_amount}
          onChange={handleChange}
        />
      </Form.Group>

      {/* 🧰 Maintenance Charge */}
      <Form.Group className="mb-3">
        <Form.Label>Maintenance Charge</Form.Label>
        <Form.Control
          name="maintenance_charge"
          type="number"
          value={form.maintenance_charge}
          onChange={handleChange}
        />
      </Form.Group>

      {/* 🧮 Total */}
      <Form.Group className="mb-3">
        <Form.Label>Total Amount</Form.Label>
        <Form.Control type="number" value={form.total_amount} readOnly />
      </Form.Group>

      {/* 📍 Status */}
      <Form.Group className="mb-3">
        <Form.Label>Status</Form.Label>
        <Form.Select
          name="status"
          value={form.status}
          onChange={handleChange}
        >
          <option value="Due">Due</option>
          <option value="Paid">Paid</option>
        </Form.Select>
      </Form.Group>

      {/* ✅ Submit */}
      <Button type="submit" variant="success" className="w-100">
        {rent ? "Update Rent" : "Add Rent"}
      </Button>
    </Form>
  );
};

export default RentForm;
