import React from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Profile</h1>
          <p className="text-gray-600">
            Profile functionality is currently unavailable.
          </p>
          {user && (
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <p className="text-gray-700">
                <strong>Logged in as:</strong> {user.name}
              </p>
              <p className="text-gray-600">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
