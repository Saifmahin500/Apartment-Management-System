import React, { useState } from "react";
import ProfileView from "./ProfileView";
import ProfileEdit from "./ProfileEdit";

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Profile</h1>

      {editing ? (
        <ProfileEdit onBack={() => setEditing(false)} />
      ) : (
        <ProfileView onEdit={() => setEditing(true)} />
      )}
    </div>
  );
};

export default ProfilePage;
