import { useEffect, useState } from "react";
import {
  getAllRequests,
  updateRequestStatus,
} from "../../api/serviceApi";

export default function AdminServiceRequests() {
  const [requests, setRequests] = useState([]);

  const loadRequests = () => {
    getAllRequests()
      .then((res) => setRequests(res.data))
      .catch(() => alert("Failed to load requests."));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleUpdate = async (id, status) => {
    const charge = status === "approved" ? prompt("Enter charge:") : null;
    await updateRequestStatus(id, { status, charge });
    loadRequests();
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">All Service Requests</h2>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Tenant</th>
            <th className="p-2 border">Service</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="p-2 border">{req.tenant?.name || "-"}</td>
              <td className="p-2 border">{req.service?.name}</td>
              <td className="p-2 border">{req.status}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleUpdate(req.id, "approved")}
                  className="bg-green-600 text-white px-2 py-1 rounded mr-2"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleUpdate(req.id, "rejected")}
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
