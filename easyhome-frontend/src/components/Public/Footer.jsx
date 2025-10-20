import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ siteName, address, phone, email }) {
  return (
    <>
      <style>{`
        :root {
          --brand-dark: #133232;
          --brand-teal: #1C8A96;
        }

        .footer-main {
          background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-teal) 100%);
          color: white;
          padding: 60px 0 0;
          margin-top: 20px;
        }

        .footer-section-title {
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
          color: white;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background: white;
          border-radius: 2px;
        }

        .footer-logo {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .footer-logo i {
          font-size: 2.5rem;
        }

        .footer-description {
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.7;
          margin-bottom: 1.5rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .footer-links li {
          margin-bottom: 12px;
        }

        .footer-links a {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .footer-links a:hover {
          color: white;
          padding-left: 5px;
        }

        .footer-links i {
          font-size: 0.9rem;
        }

        .contact-item {
          display: flex;
          align-items: start;
          gap: 15px;
          margin-bottom: 20px;
          color: rgba(255, 255, 255, 0.85);
        }

        .contact-icon {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 1.2rem;
        }

        .contact-text {
          flex: 1;
        }

        .contact-text strong {
          display: block;
          margin-bottom: 3px;
          color: white;
        }

        .social-links {
          display: flex;
          gap: 15px;
          margin-top: 1.5rem;
        }

        .social-link {
          width: 45px;
          height: 45px;
          background: rgba(255, 255, 255, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          text-decoration: none;
          transition: all 0.3s ease;
          font-size: 1.2rem;
        }

        .social-link:hover {
          background: white;
          color: var(--brand-teal);
          transform: translateY(-5px);
        }

        .footer-bottom {
          background: rgba(0, 0, 0, 0.2);
          padding: 25px 0;
          margin-top: 50px;
          text-align: center;
        }

        .footer-bottom p {
          margin: 0;
          color: rgba(255, 255, 255, 0.85);
        }

        .footer-bottom a {
          color: white;
          text-decoration: none;
          font-weight: 600;
        }

        .footer-bottom a:hover {
          text-decoration: underline;
        }

        @media (max-width: 768px) {
          .footer-main {
            padding: 40px 0 0;
          }

          .footer-section-title {
            font-size: 1.2rem;
            margin-top: 2rem;
          }

          .footer-section-title:first-child {
            margin-top: 0;
          }

          .footer-logo {
            font-size: 1.6rem;
          }

          .social-links {
            justify-content: center;
          }
        }
      `}</style>

      <footer className="footer-main">
        <div className="container">
          <div className="row">
            {/* About Section */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className="footer-logo">
                <i className="fas fa-home"></i>
                <span>{siteName || "EasyHome"}</span>
              </div>
              <p className="footer-description">
                Your trusted partner for hassle-free apartment management. We provide 
                comprehensive solutions for flat rentals, tenant management, and property services.
              </p>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <h3 className="footer-section-title">Quick Links</h3>
              <ul className="footer-links">
                <li>
                  <Link to="/">
                    <i className="fas fa-chevron-right"></i>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/flats">
                    <i className="fas fa-chevron-right"></i>
                    Flats
                  </Link>
                </li>
                <li>
                  <Link to="/services">
                    <i className="fas fa-chevron-right"></i>
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/about">
                    <i className="fas fa-chevron-right"></i>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact">
                    <i className="fas fa-chevron-right"></i>
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h3 className="footer-section-title">Our Services</h3>
              <ul className="footer-links">
                <li>
                  <a href="#">
                    <i className="fas fa-check-circle"></i>
                    Flat Management
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-check-circle"></i>
                    Tenant Screening
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-check-circle"></i>
                    Rent Collection
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-check-circle"></i>
                    Maintenance Services
                  </a>
                </li>
                <li>
                  <a href="#">
                    <i className="fas fa-check-circle"></i>
                    24/7 Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div className="col-lg-3 col-md-6 mb-4">
              <h3 className="footer-section-title">Contact Us</h3>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-text">
                  <strong>Address</strong>
                  {address || "Dhaka, Bangladesh"}
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone-alt"></i>
                </div>
                <div className="contact-text">
                  <strong>Phone</strong>
                  {phone || "+880 1234-567890"}
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <strong>Email</strong>
                  {email || "info@easyhome.com"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="container">
            <p>
              © {new Date().getFullYear()} <strong>{siteName || "EasyHome"}</strong>. 
              All Rights Reserved. | Designed with <i className="fas fa-heart text-danger"></i> by Saif Mahin
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}