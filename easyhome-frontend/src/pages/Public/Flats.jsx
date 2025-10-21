import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import PublicLayout from "../../layout/PublicLayout";
import { Link } from "react-router-dom"; // ✅ Added

export default function Flats() {
  const [flats, setFlats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/flats/simple")
      .then((res) => setFlats(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PublicLayout>
      <div className="container py-5 my-5">
        <h2 className="text-center fw-bold mb-4">
          🏢 All Available Flats
        </h2>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status"></div>
            <p>Loading flats...</p>
          </div>
        ) : flats.length === 0 ? (
          <p className="text-center text-muted">No available flats found.</p>
        ) : (
          <div className="row g-4">
            {flats.map((flat) => (
              <div className="col-lg-4 col-md-6" key={flat.id}>
                <div className="card h-100 shadow-sm border-0">
                  <img
                    src={flat.image}
                    alt={flat.name}
                    className="card-img-top"
                    style={{ height: "220px", objectFit: "cover" }}
                    onError={(e) => (e.target.src = "/images/flat.jpg")}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold">{flat.name}</h5>
                    <p className="text-muted mb-1">
                      Floor: {flat.floor || "N/A"}
                    </p>
                    <p className="text-muted mb-2">
                      Size: {flat.size || "N/A"} sq.ft
                    </p>
                    <p className="fw-bold text-primary mb-3">
                      ৳{flat.rent_amount}/month
                    </p>

                    {/* ✅ Dynamic View Details Button */}
                    <Link
                      to={`/flats/${flat.id}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
