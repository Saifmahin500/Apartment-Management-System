import React from "react";
import { Link, NavLink } from "react-router-dom";
import logoImg from "../../assets/house-apartment-logo.png";

export default function Navbar({ siteName, logo }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* 🔹 Logo + Site Name */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <img
            src={logoImg}
            width="50"
            height="50"
          />
          <span className="fw-bold text-primary">{siteName || "EasyHome"}</span>
        </Link>

        {/* 🔹 Mobile Toggle */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 🔹 Menu Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 fw-semibold">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/flats">
                Flats
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/services">
                Services
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/contact">
                Contact
              </NavLink>
            </li>
          </ul>

          {/* 🔹 Login Button */}
          <Link
            to="/login"
            className="btn btn-primary ms-lg-3 px-3 py-1 fw-semibold"
          >
            🔐 Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
