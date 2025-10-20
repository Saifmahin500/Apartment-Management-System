import { useEffect, useState } from "react";
import { getPublicServices, createServiceRequest } from "../../api/serviceApi";

export default function TenantServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getPublicServices()
      .then((res) => setServices(res.data))
      .catch(() => alert("Failed to load services."));
  }, []);

  const handleRequest = async (serviceId) => {
    setLoading(true);
    try {
      const payload = {
        flat_id: 1, 
        service_id: serviceId,
        request_date: new Date().toISOString().split("T")[0],
      };
      await createServiceRequest(payload);
      alert("✅ Service request submitted!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Request a Service</h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="border p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">{srv.name}</h3>
            <p className="text-gray-600 text-sm mb-2">{srv.description}</p>
            <p className="text-sm text-gray-800 mb-3">
              Charge: ৳{srv.base_charge}
            </p>
            <button
              onClick={() => handleRequest(srv.id)}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700"
            >
              {loading ? "Sending..." : "Request Service"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
