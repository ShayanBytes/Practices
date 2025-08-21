import React from "react";
import { Link } from "react-router-dom";

const AttendeeRegisteredEventsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            My Registered Events
          </h1>
          <Link to="/events" className="btn btn-primary">
            Browse More Events
          </Link>
        </div>

        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M22 10v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2zM8 14v2H6v-2h2zm4 0v2h-2v-2h2z" />
              <path d="M20 6V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v2" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No events registered yet
          </h3>
          <p className="text-gray-500 mb-6">
            Discover and register for interesting events!
          </p>
          <Link to="/events" className="btn btn-primary">
            Browse Events
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AttendeeRegisteredEventsPage;
