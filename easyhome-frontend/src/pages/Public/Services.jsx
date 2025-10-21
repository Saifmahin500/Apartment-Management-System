import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import PublicLayout from "../../layout/PublicLayout";

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/public/services")
      .then((res) => setServices(res.data))
      .finally(() => setLoading(false));
  }, []);

  // Service icons mapping
  const getServiceIcon = (name) => {
    const icons = {
      maintenance: "🔧",
      cleaning: "✨",
      security: "🛡️",
      plumbing: "🚰",
      electrical: "💡",
      internet: "🌐",
      parking: "🚗",
      laundry: "🧺",
      gardening: "🌿",
      pest: "🐛",
      default: "🧰"
    };
    
    const key = Object.keys(icons).find(k => 
      name.toLowerCase().includes(k)
    ) || 'default';
    
    return icons[key];
  };

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="bg-dark text-white py-5" style={{ background: "linear-gradient(135deg, #133232 0%, #1C8A96 100%)" }}>
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-3">Our Services</h1>
          <p className="lead mb-0">Everything you need for comfortable apartment living</p>
        </div>
      </div>

      <div className="container py-5 my-4">
        {loading ? (
          <div className="text-center mt-5 py-5">
            <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}></div>
            <p className="text-muted fs-5">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-5">
            <div className="display-1 mb-3">🔍</div>
            <h3 className="text-muted">No services available at the moment</h3>
            <p className="text-muted">Please check back later</p>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="row g-4 mb-5">
              {services.map((srv) => (
                <div className="col-md-6 col-lg-4" key={srv.id}>
                  <div className="card h-100 border-0 shadow-sm service-card">
                    <div className="card-body p-4 text-center">
                      {/* Icon */}
                      <div 
                        className="mb-3 mx-auto d-inline-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: "80px",
                          height: "80px",
                          background: "linear-gradient(135deg, #1C8A96 0%, #133232 100%)",
                          fontSize: "2.5rem"
                        }}
                      >
                        {getServiceIcon(srv.name)}
                      </div>

                      {/* Service Name */}
                      <h4 className="fw-bold mb-3" style={{ color: "#133232" }}>
                        {srv.name}
                      </h4>

                      {/* Description */}
                      <p className="text-muted mb-4" style={{ minHeight: "60px" }}>
                        {srv.description || "Professional service available for residents"}
                      </p>

                      {/* Price Badge */}
                      <div 
                        className="d-inline-block px-4 py-2 rounded-pill"
                        style={{ 
                          background: "linear-gradient(135deg, #1C8A96 0%, #133232 100%)",
                          color: "white"
                        }}
                      >
                        <span className="fw-semibold">Base Charge: ৳{srv.base_charge}</span>
                      </div>
                    </div>
                    
                    {/* Card Footer */}
                    <div className="card-footer bg-light border-0 text-center py-3">
                      <button 
                        className="btn btn-sm text-white"
                        style={{ 
                          background: "linear-gradient(135deg, #1C8A96 0%, #133232 100%)",
                          border: "none"
                        }}
                      >
                        Request Service
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Info Section */}
            <div className="row mt-5 pt-4">
              <div className="col-lg-10 mx-auto">
                <div 
                  className="card border-0 shadow-lg"
                  style={{ 
                    background: "linear-gradient(135deg, #133232 0%, #1C8A96 100%)"
                  }}
                >
                  <div className="card-body p-5 text-white text-center">
                    <div className="mb-3">
                      <span className="fs-1">📞</span>
                    </div>
                    <h3 className="fw-bold mb-3">Need Help with Services?</h3>
                    <p className="mb-4 opacity-75">
                      Contact our support team for any service-related queries or custom requests
                    </p>
                    <button className="btn btn-light btn-lg px-5 fw-semibold">
                      Contact Support
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="row mt-5 pt-4 g-4">
              <div className="col-md-4">
                <div className="text-center p-4">
                  <div className="display-4 mb-3">⚡</div>
                  <h5 className="fw-bold mb-2">Quick Response</h5>
                  <p className="text-muted small">Fast service delivery within 24 hours</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-4">
                  <div className="display-4 mb-3">👨‍🔧</div>
                  <h5 className="fw-bold mb-2">Expert Team</h5>
                  <p className="text-muted small">Certified and experienced professionals</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-4">
                  <div className="display-4 mb-3">💯</div>
                  <h5 className="fw-bold mb-2">Quality Guaranteed</h5>
                  <p className="text-muted small">100% satisfaction or money back</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Custom CSS for hover effects */}
      <style>{`
        .service-card {
          transition: all 0.3s ease;
        }
        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
        }
        .btn:hover {
          transform: scale(1.05);
          transition: transform 0.2s ease;
        }
      `}</style>
    </PublicLayout>
  );
}