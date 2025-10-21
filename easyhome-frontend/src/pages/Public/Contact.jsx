import React, { useState } from "react";
import PublicLayout from "../../layout/PublicLayout";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccess(true);
    setForm({ name: "", email: "", message: "" });
    
    // Auto hide success message after 5 seconds
    setTimeout(() => setSuccess(false), 5000);
  };

  const contactInfo = [
    {
      icon: "fa-map-marker-alt",
      title: "Visit Us",
      content: "123 Main Street, Downtown",
      subContent: "Dhaka, Bangladesh"
    },
    {
      icon: "fa-phone-alt",
      title: "Call Us",
      content: "+880 1234-567890",
      subContent: "Mon - Fri: 9AM - 6PM"
    },
    {
      icon: "fa-envelope",
      title: "Email Us",
      content: "info@easyhome.com",
      subContent: "We reply within 24 hours"
    }
  ];

  return (
    <PublicLayout>
      {/* Hero Section */}
      <div className="bg-dark text-white py-5" style={{ background: "linear-gradient(135deg, #133232 0%, #1C8A96 100%)" }}>
        <div className="container text-center py-4">
          <h1 className="display-4 fw-bold mb-3">Get In Touch</h1>
          <p className="lead mb-0">We'd love to hear from you. Send us a message!</p>
        </div>
      </div>

      <div className="container py-5">
        {/* Contact Info Cards */}
        <div className="row g-4 mb-5">
          {contactInfo.map((info, idx) => (
            <div key={idx} className="col-md-4">
              <div className="card border-0 shadow-sm h-100 text-center p-4 contact-info-card">
                <div 
                  className="mx-auto mb-3 d-inline-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "70px",
                    height: "70px",
                    background: "linear-gradient(135deg, #1C8A96 0%, #133232 100%)"
                  }}
                >
                  <i className={`fas ${info.icon} text-white`} style={{ fontSize: "1.5rem" }}></i>
                </div>
                <h5 className="fw-bold mb-3" style={{ color: "#133232" }}>{info.title}</h5>
                <p className="mb-1 fw-semibold">{info.content}</p>
                <p className="text-muted small mb-0">{info.subContent}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form Section */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold mb-2" style={{ color: "#133232" }}>Send Us a Message</h2>
                  <p className="text-muted">Fill out the form below and we'll get back to you soon</p>
                </div>

                {success && (
                  <div className="alert alert-success d-flex align-items-center mb-4" role="alert">
                    <i className="fas fa-check-circle me-2" style={{ fontSize: "1.5rem" }}></i>
                    <div>
                      <strong>Success!</strong> Your message has been sent successfully. We'll get back to you soon!
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-user me-2 text-primary"></i>Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        className="form-control form-control-lg"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-envelope me-2 text-primary"></i>Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control form-control-lg"
                        placeholder="your.email@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        <i className="fas fa-comment-dots me-2 text-primary"></i>Your Message
                      </label>
                      <textarea
                        name="message"
                        className="form-control form-control-lg"
                        rows="6"
                        placeholder="Write your message here..."
                        value={form.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    
                    <div className="col-12 mt-4">
                      <button 
                        type="submit" 
                        className="btn btn-lg w-100 text-white fw-semibold"
                        style={{ 
                          background: "linear-gradient(135deg, #1C8A96 0%, #133232 100%)",
                          border: "none"
                        }}
                      >
                        <i className="fas fa-paper-plane me-2"></i>Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="row mt-5 pt-5">
          <div className="col-lg-10 mx-auto">
            <div className="text-center mb-5">
              <h2 className="fw-bold mb-3" style={{ color: "#133232" }}>Frequently Asked Questions</h2>
              <p className="text-muted">Quick answers to common questions</p>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <i className="fas fa-question-circle text-primary" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">What are your office hours?</h5>
                    <p className="text-muted mb-0">We're open Monday to Friday, 9:00 AM to 6:00 PM. Emergency services available 24/7.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <i className="fas fa-question-circle text-primary" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">How quickly do you respond?</h5>
                    <p className="text-muted mb-0">We typically respond to all inquiries within 24 hours during business days.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <i className="fas fa-question-circle text-primary" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Can I schedule a visit?</h5>
                    <p className="text-muted mb-0">Yes! Contact us to schedule a property tour at your convenience.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="d-flex">
                  <div className="me-3">
                    <i className="fas fa-question-circle text-primary" style={{ fontSize: "1.5rem" }}></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-2">Do you offer maintenance support?</h5>
                    <p className="text-muted mb-0">Absolutely! We provide 24/7 maintenance support for all residents.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="row mt-5 pt-5">
          <div className="col-12">
            <div className="card border-0 shadow-lg overflow-hidden">
              <div className="ratio ratio-21x9">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.9040225498896!2d90.38698831498153!3d23.750891084587394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1234567890"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Office Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .contact-info-card {
          transition: all 0.3s ease;
        }
        .contact-info-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
        }
        .form-control:focus {
          border-color: #1C8A96;
          box-shadow: 0 0 0 0.25rem rgba(28, 138, 150, 0.25);
        }
        .btn:hover {
          transform: scale(1.02);
          transition: transform 0.2s ease;
        }
      `}</style>
    </PublicLayout>
  );
}