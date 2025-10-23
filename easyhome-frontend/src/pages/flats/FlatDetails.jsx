import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import PublicLayout from "../../layout/PublicLayout";

export default function FlatDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState(null);

  const defaultImage =
    "https://images.unsplash.com/photo-1631679706909-1844bbd07221?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8bGl2aW5nJTIwcm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=600";

  useEffect(() => {
    const fetchFlat = async () => {
      try {
        const res = await axiosClient.get(`/public/flats/${id}`);
        setFlat(res.data);
      } catch (error) {
        console.error("Failed to fetch flat details:", error);
      } finally {
        setLoading(false);
      }
    };

    // ✅ Try to read logged-in user info from localStorage
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role === "tenant" && token) {
      setUser({ role, token });
    }


    fetchFlat();
  }, [id]);

  // 🧾 Rent Request Function
  const handleRentRequest = async () => {
    if (!user) {
      alert("Please login as tenant to send rent request.");
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axiosClient.post(
        "/tenant/rent-request",
        { flat_id: flat.id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message || "Request sent successfully!");
    } catch (error) {
      console.error("Rent request error:", error);
      setMessage(
        error.response?.data?.message || "Failed to send rent request."
      );
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p>Loading flat details...</p>
      </div>
    );

  if (!flat)
    return (
      <PublicLayout>
        <h4 className="text-center text-danger mt-5">Flat not found!</h4>
      </PublicLayout>
    );

  return (
    <PublicLayout>
      <div className="container py-5 my-5">
        <div className="row">
          {/* 🏠 Flat Image */}
          <div className="col-md-6">
            <img
              src={flat.image && flat.image.trim() !== "" ? flat.image : defaultImage}
              alt={flat.name}
              className="img-fluid rounded shadow-sm"
            />
          </div>

          {/* 🧾 Flat Details */}
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">{flat.name}</h2>
            <p className="text-muted mb-2">🏢 Floor: {flat.floor || "N/A"}</p>
            <p className="text-muted mb-2">📐 Size: {flat.size || "N/A"} sq.ft</p>
            <p className="text-primary fw-semibold fs-5 mb-3">
              ৳ {flat.rent_amount}/month
            </p>

            <p className="text-muted mb-4">
              <strong>Status:</strong>{" "}
              <span
                className={
                  flat.status === "available" ? "text-success" : "text-danger"
                }
              >
                {flat.status}
              </span>
            </p>
            <p className="text-muted mb-4"><strong>Description:</strong> This apartment offers a modern design with comfortable living spaces. Featuring spacious rooms, plenty of natural light, and premium finishes, it’s perfect for families seeking a peaceful and well-connected neighborhood.</p>

            {/* 🟢 Rent Request Button */}
            {flat.status === "available" && (
              <button
                className="btn btn-primary px-4 py-2 fw-semibold"
                onClick={handleRentRequest}
              >
                📝 Request for Rent
              </button>
            )}

            {message && (
              <div className="alert alert-info mt-3 text-center">{message}</div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
