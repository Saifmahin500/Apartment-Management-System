import { useEffect, useState } from "react";
import { getMyRequests } from "../../api/serviceApi";

export default function MyRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    getMyRequests()
      .then((res) => setRequests(res.data))
      .catch(() => alert("Failed to load requests"));
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">My Service Requests</h2>
      <table className="w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Service</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Charge</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="p-2 border">{req.service?.name}</td>
              <td className="p-2 border">{req.request_date}</td>
              <td className="p-2 border text-center">
                <span
                  className={`px-2 py-1 rounded text-white text-sm ${
                    req.status === "approved"
                      ? "bg-green-600"
                      : req.status === "rejected"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {req.status}
                </span>
              </td>
              <td className="p-2 border text-right">
                {req.charge ? `৳${req.charge}` : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
