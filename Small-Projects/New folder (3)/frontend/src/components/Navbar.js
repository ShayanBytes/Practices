import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated, isOrganizer, isAttendee } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          to={isAuthenticated ? "/events" : "/"}
          className="text-xl font-bold text-primary-600"
        >
          EventHub
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/home" className="text-gray-600 hover:text-primary-600">
                Home
              </Link>
              <Link
                to="/events"
                className="text-gray-600 hover:text-primary-600"
              >
                Events
              </Link>

              {isOrganizer && (
                <>
                  <Link
                    to="/organizer/events"
                    className="text-gray-600 hover:text-primary-600"
                  >
                    My Events
                  </Link>
                  <Link
                    to="/organizer/create-event"
                    className="text-gray-600 hover:text-primary-600"
                  >
                    Create Event
                  </Link>
                </>
              )}

              {isAttendee && (
                <Link
                  to="/attendee/registered-events"
                  className="text-gray-600 hover:text-primary-600"
                >
                  My Registrations
                </Link>
              )}

              <Link
                to="/profile"
                className="text-gray-600 hover:text-primary-600"
              >
                Profile
              </Link>

              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Hello, {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn btn-secondary text-sm"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-primary-600"
              >
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
