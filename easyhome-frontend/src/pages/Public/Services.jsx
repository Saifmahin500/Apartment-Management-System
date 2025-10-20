import { useEffect, useState } from "react";
import { getPublicServices } from "../../api/serviceApi";
import PublicLayout from "../../layout/PublicLayout";

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getPublicServices()
      .then((res) => setServices(res.data))
      .catch(() => alert("Failed to load services."));
  }, []);

  return (
    <PublicLayout>
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        🧰 Our Services
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="p-5 bg-white rounded-xl shadow hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold mb-2">{srv.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{srv.description}</p>
            <p className="text-blue-600 font-semibold">
              Base Charge: ৳{srv.base_charge}
            </p>
          </div>
        ))}
      </div>
    </div>
    </PublicLayout>
  );
}
