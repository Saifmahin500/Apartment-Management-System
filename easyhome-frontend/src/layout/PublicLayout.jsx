import React, { useEffect, useState } from "react";
import Navbar from "../components/Public/Navbar";
import Footer from "../components/Public/Footer";
import axiosClient from "../api/axiosClient";

export default function PublicLayout({ children }) {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/public/settings")
      .then((res) => setSettings(res.data))
      .catch((err) => console.error("Failed to load site settings:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading EasyHome...</p>
      </div>
    );
  }

  return (
    <>
      {/* 🔝 Navbar */}
      <Navbar siteName={settings.site_name} logo={settings.logo} />

      {/* 🧱 Page Content */}
      <main>{children}</main>

      {/* 🔚 Footer */}
      <Footer
        siteName={settings.site_name}
        address={settings.address}
        phone={settings.phone}
        email={settings.email}
      />
    </>
  );
}
