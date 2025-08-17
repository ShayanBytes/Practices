import React from "react";
import { Link } from "react-router-dom";

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full text-center">
        <div className="text-red-600 text-6xl mb-6">🚫</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please check your
          account role or contact support.
        </p>
        <div className="space-x-4">
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
          <Link to="/events" className="btn btn-secondary">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
