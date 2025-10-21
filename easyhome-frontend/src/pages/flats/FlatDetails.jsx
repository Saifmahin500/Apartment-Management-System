import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";

export default function FlatDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flat, setFlat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);

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
    fetchFlat();
  }, [id]);

  const handleRentRequest = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Please login as tenant to send request!");
      navigate("/login");
      return;
    }

    try {
      setRequesting(true);
      await axiosClient.post(
        "/service-requests",
        { flat_id: id, service_id: 1, request_date: new Date().toISOString().split("T")[0] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Rent request sent successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send rent request!");
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-2">Loading Flat Details...</p>
      </div>
    );
  }

  if (!flat) {
    return (
      <div className="text-center mt-5 text-danger">
        <h4>Flat not found!</h4>
      </div>
    );
  }

  return (
    <div className="container my-5">
      {/* 🖼️ Image Gallery */}
      <div id="flatCarousel" className="carousel slide mb-4" data-bs-ride="carousel">
        <div className="carousel-inner rounded shadow-sm">
          {flat.images && flat.images.length > 0 ? (
            flat.images.map((img, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={img.url}
                  className="d-block w-100"
                  alt={`Flat Image ${index + 1}`}
                  style={{ height: "400px", objectFit: "cover" }}
                />
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <img
                src="/images/default-flat.jpg"
                className="d-block w-100"
                alt="Default"
                style={{ height: "400px", objectFit: "cover" }}
              />
            </div>
          )}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#flatCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#flatCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* 🧾 Flat Info */}
      <div className="card shadow-sm border-0 p-4">
        <h3 className="fw-bold mb-3">{flat.name}</h3>
        <p><strong>Floor:</strong> {flat.floor}</p>
        <p><strong>Size:</strong> {flat.size} sqft</p>
        <p><strong>Rent Amount:</strong> ৳{flat.rent_amount}/month</p>
        <p><strong>Status:</strong> {flat.status}</p>

        {flat.building && (
          <p><strong>Building:</strong> {flat.building.name}</p>
        )}

        <hr />
        <p className="text-muted">
          Live comfortably with all essential facilities, 24/7 support, and
          secure living experience.
        </p>

        <div className="text-center mt-4">
          <button
            onClick={handleRentRequest}
            className="btn btn-primary px-4 py-2"
            disabled={requesting}
          >
            {requesting ? "Sending Request..." : "🏠 Request for Rent"}
          </button>
        </div>
      </div>
    </div>
  );
}
