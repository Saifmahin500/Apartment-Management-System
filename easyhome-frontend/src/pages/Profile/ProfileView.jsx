import React, { useEffect, useState } from "react";
import { getProfile } from "../../api/profileApi.js";
import ChangePasswordModal from "../Profile/ChangePasswordModal.jsx";
import Swal from "sweetalert2"; 

const ProfileView = ({ onEdit }) => {
  const [profile, setProfile] = useState(null);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    getProfile()
      .then((res) => {
        setProfile(res.data.data);
      })
      .catch((err) => {
        console.error(err);
        Swal.fire("Error", "Failed to load profile data.", "error");
      });
  }, []);

  if (!profile)
    return (
      <div className="text-center py-10 text-gray-600 font-medium">
        Loading profile...
      </div>
    );

  return (
    <div className="max-w-lg mx-auto bg-white shadow-md p-6 rounded-2xl relative">
      {/* Profile Info */}
      <div className="flex flex-col items-center">
        <img
          src={
            profile.profile_photo
              ? `http://127.0.0.1:8000${profile.profile_photo}`
              : "https://via.placeholder.com/150"
          }
          alt="Profile"
          className="w-24 h-24 rounded-full border mb-3"
        />
        <h2 className="text-xl font-semibold">{profile.name}</h2>
        <p className="text-gray-500">{profile.email}</p>
      </div>

      <div className="mt-5 text-sm space-y-1">
        <p>
          <strong>Phone:</strong> {profile.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong> {profile.address || "N/A"}
        </p>
        <p>
          <strong>Language:</strong> {profile.language?.toUpperCase()}
        </p>
        <p>
          <strong>Timezone:</strong> {profile.timezone}
        </p>
        <p>
          <strong>About:</strong> {profile.about || "—"}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={onEdit}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Edit Profile
        </button>

        <button
          onClick={() => setShowModal(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
        >
          Change Password
        </button>
      </div>

      {/* Change Password Modal */}
      {showModal && (
        <ChangePasswordModal
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            Swal.fire("Success!", "Password changed successfully.", "success");
          }}
        />
      )}
    </div>
  );
};

export default ProfileView;
