import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import api from "../../services/api";

const RentReport = () => {
  const [rents, setRents] = useState([]);
  const [filter, setFilter] = useState({ month: "", year: "" });
  const [summary, setSummary] = useState({ total: 0, paid: 0, due: 0 });

  const fetchRents = async () => {
    try {
      const res = await api.get("/rents");
      let data = res.data;

      // Apply filters
      if (filter.month) data = data.filter((r) => r.month === filter.month);
      if (filter.year) data = data.filter((r) => r.year == filter.year);

      setRents(data);

      // Calculate summary
      const total = data.reduce((acc, r) => acc + (parseFloat(r.total_amount) || 0), 0);
      const paid = data
        .filter((r) => r.status === "Paid")
        .reduce((acc, r) => acc + (parseFloat(r.total_amount) || 0), 0);
      const due = total - paid;

      setSummary({ total, paid, due });
    } catch (err) {
      console.error("Error fetching rents:", err);
    }
  };

  useEffect(() => {
    fetchRents();
  }, [filter]);

  return (
    <div className="container mt-4">
      <h3 className="mb-3">📊 Rent Summary Report</h3>

      {/* Filters */}
      <div className="d-flex gap-3 mb-3">
        <Form.Select
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
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

        <Form.Control
          type="number"
          placeholder="Enter Year"
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
        />
      </div>

      {/* Summary Section */}
      <div className="mb-3">
        <strong>Total Rent:</strong> ৳{summary.total} |
        <strong className="text-success ms-2"> Paid:</strong> ৳{summary.paid} |
        <strong className="text-danger ms-2"> Due:</strong> ৳{summary.due}
      </div>

      {/* Table */}
      <Table bordered hover>
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Flat</th>
            <th>Month</th>
            <th>Year</th>
            <th>Total Rent</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rents.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No records found
              </td>
            </tr>
          ) : (
            rents.map((r, i) => (
              <tr key={r.id}>
                <td>{i + 1}</td>
                <td>{r.flat?.name || "N/A"}</td>
                <td>{r.month}</td>
                <td>{r.year}</td>
                <td>৳{r.total_amount}</td>
                <td>
                  <span
                    className={`badge ${
                      r.status === "Paid" ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default RentReport;
