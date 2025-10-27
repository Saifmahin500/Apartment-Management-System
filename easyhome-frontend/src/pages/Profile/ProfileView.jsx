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
      <div className="text-center py-5">
        <div className="spinner-border" style={{ color: '#1C8A96' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 fw-medium" style={{ color: '#133232' }}>Loading profile...</p>
      </div>
    );

  return (
    <>
      <style>{`
        .profile-card {
          max-width: 600px;
          margin: 0 auto;
          border-radius: 16px;
          box-shadow: 0 4px 20px rgba(19, 50, 50, 0.15);
          overflow: hidden;
        }
        .profile-header {
          background: linear-gradient(135deg, #133232 0%, #1C8A96 100%);
          padding: 2rem 1.5rem;
          position: relative;
        }
        .profile-avatar {
          width: 120px;
          height: 120px;
          border: 5px solid white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          object-fit: cover;
        }
        .profile-name {
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1rem;
          margin-bottom: 0.25rem;
        }
        .profile-email {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.95rem;
        }
        .profile-body {
          padding: 2rem 1.5rem;
          background: white;
        }
        .info-row {
          padding: 0.75rem 0;
          border-bottom: 1px solid #f0f0f0;
        }
        .info-row:last-child {
          border-bottom: none;
        }
        .info-label {
          color: #6c757d;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }
        .info-value {
          color: #133232;
          font-size: 1rem;
          font-weight: 500;
        }
        .btn-edit {
          background-color: #1C8A96;
          border: none;
          color: white;
          padding: 0.625rem 1.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-edit:hover {
          background-color: #133232;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(28, 138, 150, 0.3);
        }
        .btn-password {
          background-color: white;
          border: 2px solid #133232;
          color: #133232;
          padding: 0.625rem 1.75rem;
          border-radius: 8px;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-password:hover {
          background-color: #133232;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(19, 50, 50, 0.3);
        }
        .profile-actions {
          padding: 1.5rem;
          background: #f8f9fa;
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        @media (max-width: 576px) {
          .profile-actions {
            flex-direction: column;
          }
          .btn-edit, .btn-password {
            width: 100%;
          }
        }
      `}</style>

      <div className="profile-card">
        {/* Profile Header */}
        <div className="profile-header text-center">
          <div className="d-flex flex-column align-items-center">
            <img
              src={
                profile.profile_photo
                  ? `http://127.0.0.1:8000${profile.profile_photo}`
                  : "https://via.placeholder.com/150"
              }
              alt="Profile"
              className="rounded-circle profile-avatar"
            />
            <h2 className="profile-name">{profile.name}</h2>
            <p className="profile-email mb-0">{profile.email}</p>
          </div>
        </div>

        {/* Profile Body */}
        <div className="profile-body">
          <div className="info-row">
            <div className="info-label">📞 Phone</div>
            <div className="info-value">{profile.phone || "N/A"}</div>
          </div>

          <div className="info-row">
            <div className="info-label">📍 Address</div>
            <div className="info-value">{profile.address || "N/A"}</div>
          </div>

          <div className="info-row">
            <div className="info-label">🌐 Language</div>
            <div className="info-value">{profile.language?.toUpperCase()}</div>
          </div>

          <div className="info-row">
            <div className="info-label">🕒 Timezone</div>
            <div className="info-value">{profile.timezone}</div>
          </div>

          <div className="info-row">
            <div className="info-label">📝 About</div>
            <div className="info-value">{profile.about || "—"}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions">
          <button
            onClick={onEdit}
            className="btn btn-edit"
          >
            ✏️ Edit Profile
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="btn btn-password"
          >
            🔒 Change Password
          </button>
        </div>
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
    </>
  );
};

export default ProfileView;