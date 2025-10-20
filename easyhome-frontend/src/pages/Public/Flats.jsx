import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import PublicLayout from "../../layout/PublicLayout";

export default function Flats() {
  const [flats, setFlats] = useState([]);

  useEffect(() => {
    axiosClient.get("/flats/simple").then((res) => setFlats(res.data));
  }, []);

  return (
    <PublicLayout>
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Available Flats</h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {flats.map((flat) => (
          <div key={flat.id} className="p-4 border rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-bold mb-2">{flat.name}</h3>
            <p className="text-sm text-gray-600">Building: {flat.building_name}</p>
            <p className="text-sm text-gray-600">Floor: {flat.floor}</p>
            <p className="text-sm text-gray-800 font-medium mt-2">
              Rent: ৳{flat.rent_amount}
            </p>
          </div>
        ))}
      </div>
    </div>
    </PublicLayout>
  );
}
