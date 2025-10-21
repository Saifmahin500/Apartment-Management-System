import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import PublicLayout from "../../layout/PublicLayout";

export default function Home() {
  const [flats, setFlats] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [flatsRes, servicesRes] = await Promise.all([
          axiosClient.get("/flats/simple"),
          axiosClient.get("/public/services"),
        ]);
        setFlats(flatsRes.data.slice(0, 6));
        setServices(servicesRes.data.slice(0, 4));
      } catch (error) {
        console.error("Failed to load home data:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <PublicLayout>
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="mt-2 text-muted">Loading EasyHome...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <style>{`
        body {
          font-family: 'Noto Sans Bengali', sans-serif;
        }

        :root {
          --brand-dark: #133232;
          --brand-teal: #1C8A96;
        }

        /* Hero Carousel Section */
        .hero-section {
          position: relative;
          overflow: hidden;
        }

        .carousel-slide {
          height: 600px;
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .carousel-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(19, 50, 50, 0.85) 0%, rgba(99, 121, 124, 0.75) 100%);
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          color: white;
        }

        .carousel-control-prev,
        .carousel-control-next {
          width: 60px;
          height: 60px;
          background-color: rgba(28, 138, 150, 0.8);
          border-radius: 50%;
          top: 50%;
          transform: translateY(-50%);
          opacity: 1;
          transition: all 0.3s ease;
          z-index: 3;
        }

        .carousel-control-prev {
          left: 30px;
        }

        .carousel-control-next {
          right: 30px;
        }

        .carousel-control-prev:hover,
        .carousel-control-next:hover {
          background-color: var(--brand-dark);
          transform: translateY(-50%) scale(1.1);
        }

        .carousel-indicators {
          z-index: 3;
          margin-bottom: 2rem;
        }

        .carousel-indicators button {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          border: 2px solid white;
          transition: all 0.3s ease;
        }

        .carousel-indicators button.active {
          background-color: white;
          width: 40px;
          border-radius: 6px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 800;
          margin-bottom: 1.5rem;
          line-height: 1.2;
        }

        .hero-subtitle {
          font-size: 1.4rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
          font-weight: 400;
        }

        .hero-buttons .btn {
          margin: 0.5rem;
          padding: 14px 35px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-light-custom {
          background-color: white;
          color: var(--brand-teal);
          border: none;
        }

        .btn-light-custom:hover {
          background-color: rgba(255, 255, 255, 0.9);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .btn-outline-custom {
          background-color: transparent;
          color: white;
          border: 2px solid white;
        }

        .btn-outline-custom:hover {
          background-color: white;
          color: var(--brand-teal);
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        /* Section Styling */
        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--brand-dark);
          margin-bottom: 1rem;
          position: relative;
          display: inline-block;
        }

        .section-title::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: var(--brand-teal);
          border-radius: 2px;
        }

        .section-subtitle {
          font-size: 1.2rem;
          color: #666;
          margin-top: 1.5rem;
        }

        /* Stats Section */
        .stats-section {
          background: linear-gradient(135deg, var(--brand-teal) 0%, var(--brand-dark) 100%);
          padding: 60px 0;
          color: white;
        }

        .stat-item {
          text-align: center;
          padding: 20px;
        }

        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .stat-label {
          font-size: 1.1rem;
          opacity: 0.9;
        }

        /* Flat Card Design */
        .flat-card {
          border: none;
          border-radius: 15px;
          overflow: hidden;
          transition: all 0.4s ease;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
          height: 100%;
          background: white;
        }

        .flat-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(28, 138, 150, 0.25);
        }

        .flat-card-img {
          height: 240px;
          object-fit: cover;
          width: 100%;
          transition: transform 0.4s ease;
        }

        .flat-card:hover .flat-card-img {
          transform: scale(1.05);
        }

        .flat-card-body {
          padding: 1.8rem;
        }

        .flat-name {
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--brand-dark);
          margin-bottom: 1rem;
        }

        .flat-info {
          display: flex;
          align-items: center;
          margin-bottom: 0.8rem;
          color: #666;
          font-size: 0.95rem;
        }

        .flat-info i {
          color: var(--brand-teal);
          margin-right: 10px;
          width: 20px;
        }

        .flat-rent {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--brand-teal);
          margin: 1.2rem 0;
        }

        .btn-view-flat {
          width: 100%;
          background: var(--brand-teal);
          color: white;
          border: none;
          padding: 12px;
          font-weight: 600;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .btn-view-flat:hover {
          background: var(--brand-dark);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(28, 138, 150, 0.3);
        }

        /* Service Card */
        .service-card {
          background: white;
          border-radius: 15px;
          padding: 2.5rem 2rem;
          text-align: center;
          transition: all 0.4s ease;
          box-shadow: 0 5px 20px rgba(0, 0, 0, 0.06);
          height: 100%;
          border: 2px solid transparent;
        }

        .service-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 15px 40px rgba(28, 138, 150, 0.2);
          border-color: var(--brand-teal);
        }

        .service-icon {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--brand-teal), var(--brand-dark));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2rem;
          color: white;
        }

        .service-name {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--brand-dark);
          margin-bottom: 1rem;
        }

        .service-desc {
          color: #666;
          line-height: 1.6;
        }

        /* Features Section */
        .features-section {
          background: #f8f9fa;
          padding: 80px 0;
        }

        .feature-box {
          text-align: center;
          padding: 2rem 1.5rem;
          transition: all 0.3s ease;
        }

        .feature-box:hover {
          transform: translateY(-5px);
        }

        .feature-icon-wrapper {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, var(--brand-teal), var(--brand-dark));
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 2.5rem;
          color: white;
          box-shadow: 0 10px 30px rgba(28, 138, 150, 0.2);
        }

        .feature-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--brand-dark);
          margin-bottom: 0.8rem;
        }

        .feature-desc {
          color: #666;
          font-size: 0.95rem;
        }

        /* How It Works Section */
        .how-it-works {
          padding: 60px 0;
          background: white;
          
        }

        .step-box {
          text-align: center;
          position: relative;
          padding: 2rem 1.5rem;
        }

        .step-number {
          width: 80px;
          height: 80px;
          background: var(--brand-teal);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 20px rgba(28, 138, 150, 0.3);
        }

        .step-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--brand-dark);
          margin-bottom: 1rem;
        }

        .step-desc {
          color: #666;
          line-height: 1.6;
        }

        /* Testimonial Section */
        .testimonial-section {
          background: linear-gradient(135deg, var(--brand-dark) 0%, var(--brand-teal) 100%);
          padding: 80px 0;
          color: white;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 15px;
          padding: 2.5rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .testimonial-text {
          font-size: 1.1rem;
          font-style: italic;
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }

        .testimonial-author {
          font-weight: 700;
          font-size: 1.2rem;
        }

        /* CTA Section */
        .cta-section {
          background: var(--brand-teal);
          padding: 80px 0;
          text-align: center;
          color: white;
          margin-top:10px;
        }

        .cta-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 1rem;
        }

        .cta-subtitle {
          font-size: 1.3rem;
          margin-bottom: 2.5rem;
          opacity: 0.95;
        }

        .btn-cta {
          background: white;
          color: var(--brand-teal);
          padding: 15px 40px;
          font-size: 1.2rem;
          font-weight: 700;
          border-radius: 8px;
          border: none;
          transition: all 0.3s ease;
        }

        .btn-cta:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          background: var(--brand-dark);
          color: white;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .carousel-slide {
            height: 500px;
          }

          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-subtitle {
            font-size: 1.1rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .stat-number {
            font-size: 2.2rem;
          }

          .hero-buttons .btn {
            display: block;
            width: 100%;
            margin: 0.5rem 0;
          }

          .carousel-control-prev,
          .carousel-control-next {
            width: 45px;
            height: 45px;
          }

          .carousel-control-prev {
            left: 15px;
          }

          .carousel-control-next {
            right: 15px;
          }
        }
      `}</style>

      {/* Hero Carousel Section */}
      <section className="hero-section py-2">
        <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-indicators">
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
            <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
          </div>

          <div className="carousel-inner">
            {/* Slide 1 */}
            <div className="carousel-item active">
              <div className="carousel-slide" style={{backgroundImage: "url('https://images.unsplash.com/photo-1515263487990-61b07816b324?q=80&w=2070')"}}>
                <div className="carousel-overlay"></div>
                <div className="container">
                  <div className="row align-items-center" style={{minHeight: '600px'}}>
                    <div className="col-lg-8 mx-auto text-center hero-content">
                      <h1 className="hero-title">Welcome to EasyHome</h1>
                      <p className="hero-subtitle">
                        Your Complete Apartment Management Solution - Manage Flats, Tenants & Rent with Ease
                      </p>
                      <div className="hero-buttons">
                        <Link to="/flats" className="btn btn-light-custom">
                          <i className="fas fa-building me-2"></i>Explore Flats
                        </Link>
                        <Link to="/login" className="btn btn-outline-custom">
                          <i className="fas fa-sign-in-alt me-2"></i>Login
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2 */}
            <div className="carousel-item">
              <div className="carousel-slide" style={{backgroundImage: "url('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070')"}}>
                <div className="carousel-overlay"></div>
                <div className="container">
                  <div className="row align-items-center" style={{minHeight: '600px'}}>
                    <div className="col-lg-8 mx-auto text-center hero-content">
                      <h1 className="hero-title">Automated Rent Tracking</h1>
                      <p className="hero-subtitle">
                        Manage rent payments easily and securely with our smart system
                      </p>
                      <div className="hero-buttons">
                        <Link to="/flats" className="btn btn-light-custom">
                          <i className="fas fa-search me-2"></i>Learn More
                        </Link>
                        <Link to="/contact" className="btn btn-outline-custom">
                          <i className="fas fa-phone me-2"></i>Contact Us
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3 */}
            <div className="carousel-item">
              <div className="carousel-slide" style={{backgroundImage: "url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070')"}}>
                <div className="carousel-overlay"></div>
                <div className="container">
                  <div className="row align-items-center" style={{minHeight: '600px'}}>
                    <div className="col-lg-8 mx-auto text-center hero-content">
                      <h1 className="hero-title">Easy Tenant Management</h1>
                      <p className="hero-subtitle">
                        All tenants and services in one powerful dashboard
                      </p>
                      <div className="hero-buttons">
                        <Link to="/flats" className="btn btn-light-custom">
                          <i className="fas fa-users me-2"></i>Get Started
                        </Link>
                        <Link to="/contact" className="btn btn-outline-custom">
                          <i className="fas fa-envelope me-2"></i>Contact Us
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Controls */}
          <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Happy Tenants</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">10+</div>
                <div className="stat-label">Available Flats</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">5+</div>
                <div className="stat-label">Building Owners</div>
              </div>
            </div>
            <div className="col-md-3 col-6">
              <div className="stat-item">
                <div className="stat-number">24/7</div>
                <div className="stat-label">Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Flats Section */}
      <section className="container py-5 my-5">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-home me-2"></i>Available Flats
          </h2>
          <p className="section-subtitle">Find your perfect home from our curated collection</p>
        </div>
        <div className="row g-4">
          {flats.map((flat) => (
            <div className="col-lg-4 col-md-6" key={flat.id}>
              <div className="flat-card">
              <img
                    src={
                        flat.image && flat.image.includes("http")
                        ? flat.image
                        : "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
                    }
                    alt={flat.name}
                    className="flat-card-img"
                    />

                <div className="flat-card-body">
                  <h3 className="flat-name">{flat.name}</h3>
                  <div className="flat-info">
                        <i className="fas fa-layer-group"></i>
                        <span>Floor: {flat.floor || "N/A"}</span>
                        </div>
                        <div className="flat-info">
                        <i className="fas fa-ruler-combined"></i>
                        <span>Size: {flat.size ? `${flat.size}` : "N/A"} sq.ft</span>
                        </div>

                  <div className="flat-rent">
                    <i className="fas fa-bangladeshi-taka-sign me-2"></i>{flat.rent_amount}/month
                  </div>
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
        <div className="text-center mt-5">
          <Link to="/flats" className="btn btn-lg" style={{background: 'var(--brand-teal)', color: 'white', padding: '12px 40px', borderRadius: '8px', fontWeight: '600'}}>
            View All Flats <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-clipboard-list me-2"></i>How It Works
            </h2>
            <p className="section-subtitle">Get started in three simple steps</p>
          </div>
          <div className="row">
            <div className="col-md-4">
              <div className="step-box">
                <div className="step-number">1</div>
                <h3 className="step-title">Browse Flats</h3>
                <p className="step-desc">
                  Explore our wide range of available flats with detailed information and photos
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-box">
                <div className="step-number">2</div>
                <h3 className="step-title">Contact Us</h3>
                <p className="step-desc">
                  Get in touch with our team to schedule a visit or ask any questions
                </p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="step-box">
                <div className="step-number">3</div>
                <h3 className="step-title">Move In</h3>
                <p className="step-desc">
                  Complete the simple paperwork and move into your new home hassle-free
                </p>
              </div>
            </div>
          </div>
        </div>
      </section> */}

      {/* Services Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              <i className="fas fa-tools me-2"></i>Our Services
            </h2>
            <p className="section-subtitle">Everything you need for comfortable living</p>
          </div>
          <div className="row g-4">
            {services.map((srv) => (
              <div className="col-lg-4 col-md-6" key={srv.id}>
                <div className="service-card">
                  <div className="service-icon">
                    <i className="fas fa-concierge-bell"></i>
                  </div>
                  <h3 className="service-name">{srv.name}</h3>
                  <p className="service-desc">{srv.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-5 my-5">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fas fa-star me-2"></i>Why Choose EasyHome
          </h2>
          <p className="section-subtitle">Experience hassle-free apartment management</p>
        </div>
        <div className="row g-4">
          <div className="col-lg-3 col-md-6">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3 className="feature-title">Secure & Safe</h3>
              <p className="feature-desc">Your data and payments are protected with top-level security</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <i className="fas fa-credit-card"></i>
              </div>
              <h3 className="feature-title">Easy Payments</h3>
              <p className="feature-desc">Automated rent tracking and multiple payment options</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <i className="fas fa-clock"></i>
              </div>
              <h3 className="feature-title">24/7 Support</h3>
              <p className="feature-desc">Our team is always available to help you anytime</p>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="feature-box">
              <div className="feature-icon-wrapper">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="feature-title">Mobile Friendly</h3>
              <p className="feature-desc">Access everything from your phone, tablet or desktop</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title" style={{color: 'white'}}>
              <i className="fas fa-comments me-2"></i>What Our Tenants Say
            </h2>
            <p className="section-subtitle" style={{color: 'rgba(255,255,255,0.9)'}}>
              Real experiences from real people
            </p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "EasyHome made finding my apartment so simple! The process was smooth and the management is excellent."
                </p>
                <p className="testimonial-author">- Rafiq Ahmed</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "Best apartment management system I've used. Everything is organized and rent payment is hassle-free."
                </p>
                <p className="testimonial-author">- Nusrat Jahan</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="testimonial-card">
                <p className="testimonial-text">
                  "Highly recommended! The support team is very responsive and the flats are well-maintained."
                </p>
                <p className="testimonial-author">- Kamal Hossain</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Find Your Dream Home?</h2>
          <p className="cta-subtitle">
            Join hundreds of satisfied tenants and experience hassle-free living
          </p>
          <Link to="/contact" className="btn btn-cta">
            <i className="fas fa-phone-alt me-2"></i>Contact Us Today
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}