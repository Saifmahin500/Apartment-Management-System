import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import PublicLayout from "../../layout/PublicLayout";

export default function About() {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    axiosClient.get("/public/settings").then((res) => setSettings(res.data));
  }, []);

  const stats = [
    { number: "120+", label: "Total Flats", icon: "🏘️" },
    { number: "350+", label: "Happy Tenants", icon: "😊" },
    { number: "10+", label: "Years Experience", icon: "⭐" },
    { number: "98%", label: "Satisfaction Rate", icon: "💯" },
  ];

  const values = [
    { icon: "🛡️", title: "Trust & Security", description: "Your safety and privacy are our top priorities" },
    { icon: "❤️", title: "Community First", description: "Building connections and fostering belonging" },
    { icon: "🏆", title: "Excellence", description: "Committed to highest quality service" },
    { icon: "🚀", title: "Innovation", description: "Using technology to make living better" },
  ];

  const team = [
    { name: "Sarah Johnson", role: "Property Manager", img: "https://i.pravatar.cc/300?img=1" },
    { name: "Michael Chen", role: "Maintenance Head", img: "https://i.pravatar.cc/300?img=13" },
    { name: "Emily Rodriguez", role: "Customer Relations", img: "https://i.pravatar.cc/300?img=5" },
    { name: "David Kumar", role: "Operations Manager", img: "https://i.pravatar.cc/300?img=12" },
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="bg-dark text-white py-5" style={{ background: "linear-gradient(135deg, #133232 0%, #1C8A96 100%)" }}>
        <div className="container text-center py-5">
          <h1 className="display-4 fw-bold mb-3">About {settings.site_name || "EasyHome"}</h1>
          <p className="lead">Making apartment living easier, one tenant at a time</p>
        </div>
      </div>

      {/* Stats Section
      <div className="bg-light py-5">
        <div className="container">
          <div className="row g-4 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="col-6 col-md-3">
                <div className="p-3">
                  <div className="display-4 mb-2">{stat.icon}</div>
                  <h2 className="fw-bold text-primary mb-1">{stat.number}</h2>
                  <p className="text-muted mb-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Our Story Section */}
      <div className="container py-5 my-4">
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <h2 className="fw-bold mb-4" style={{ color: "#133232" }}>Our Story</h2>
            <p className="text-muted mb-3">
              Founded in 2015, {settings.site_name || "EasyHome"} was born from a simple idea: apartment 
              management should be easy, transparent, and efficient for everyone involved.
            </p>
            <p className="text-muted mb-3">
              {settings.about || 
                "We started with a single building and have grown to manage multiple properties, serving hundreds of happy tenants. Our journey has been driven by a commitment to innovation and a passion for creating comfortable living spaces."}
            </p>
            <p className="text-muted">
              Today, we combine cutting-edge technology with personalized service to deliver an apartment 
              management experience that sets new standards in the industry.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              <div className="col-6">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop" 
                  alt="Building" 
                  className="img-fluid rounded shadow-lg"
                />
              </div>
              <div className="col-6 mt-5">
                <img 
                  src="https://plus.unsplash.com/premium_photo-1689609950112-d66095626efb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687" 
                  alt="Interior" 
                  className="img-fluid rounded shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <span className="fs-3">🎯</span>
                    </div>
                    <h3 className="fw-bold mb-0" style={{ color: "#133232" }}>Our Mission</h3>
                  </div>
                  <p className="text-muted">
                    To revolutionize apartment living by providing innovative management solutions that 
                    prioritize tenant satisfaction, operational efficiency, and community building. We strive 
                    to make every resident feel at home while maintaining the highest standards of service.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                      <span className="fs-3">🏢</span>
                    </div>
                    <h3 className="fw-bold mb-0" style={{ color: "#133232" }}>Our Vision</h3>
                  </div>
                  <p className="text-muted">
                    To become the leading apartment management platform that sets industry standards for 
                    excellence, innovation, and tenant satisfaction. We envision a future where technology 
                    and personal touch combine to create truly exceptional living experiences.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="container py-5 my-4">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-3" style={{ color: "#133232" }}>Our Core Values</h2>
          <p className="text-muted">The principles that guide everything we do</p>
        </div>
        <div className="row g-4">
          {values.map((value, idx) => (
            <div key={idx} className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center hover-card">
                <div className="card-body p-4">
                  <div className="bg-primary bg-opacity-10 d-inline-flex p-3 rounded-circle mb-3">
                    <span className="fs-1">{value.icon}</span>
                  </div>
                  <h5 className="fw-bold mb-3">{value.title}</h5>
                  <p className="text-muted small mb-0">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-light py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3" style={{ color: "#133232" }}>Meet Our Team</h2>
            <p className="text-muted">Dedicated professionals committed to your comfort</p>
          </div>
          <div className="row g-4">
            {team.map((member, idx) => (
              <div key={idx} className="col-md-6 col-lg-3">
                <div className="card border-0 shadow-sm text-center">
                  <img 
                    src={member.img} 
                    alt={member.name} 
                    className="card-img-top"
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5 className="fw-bold mb-1">{member.name}</h5>
                    <p className="text-primary small mb-0">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Info Section */}
      <div className="py-5" style={{ background: "linear-gradient(135deg, #133232 0%, #1C8A96 100%)" }}>
        <div className="container">
          <div className="text-center text-white mb-5">
            <h2 className="fw-bold mb-3">Visit Us</h2>
            <p className="mb-0">We'd love to show you around</p>
          </div>
          <div className="row g-4 text-center text-white">
            <div className="col-md-4">
              <div className="p-4">
                <div className="bg-white bg-opacity-25 d-inline-flex p-3 rounded-circle mb-3">
                  <span className="fs-3">📍</span>
                </div>
                <h5 className="fw-bold mb-2">Address</h5>
                <p className="mb-0 opacity-75">{settings.address || "Dhaka, Bangladesh"}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4">
                <div className="bg-white bg-opacity-25 d-inline-flex p-3 rounded-circle mb-3">
                  <span className="fs-3">☎️</span>
                </div>
                <h5 className="fw-bold mb-2">Phone</h5>
                <p className="mb-0 opacity-75">{settings.phone || "01856590532"}</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4">
                <div className="bg-white bg-opacity-25 d-inline-flex p-3 rounded-circle mb-3">
                  <span className="fs-3">✉️</span>
                </div>
                <h5 className="fw-bold mb-2">Email</h5>
                <p className="mb-0 opacity-75">{settings.email || "info@easyhome.com"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Optional: Add custom CSS for hover effects */}
      <style>{`
        .hover-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </PublicLayout>
  );
}