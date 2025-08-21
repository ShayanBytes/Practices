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
    <nav className="navbar px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Clean Logo */}
        <Link
          to={isAuthenticated ? "/home" : "/"}
          className="flex items-center space-x-3"
        >
          <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <span className="text-white font-semibold text-sm">E</span>
          </div>
          <span className="text-xl font-semibold text-slate-900">EventHub</span>
        </Link>

        {/* Clean Navigation */}
        <div className="flex items-center space-x-6">
          {isAuthenticated ? (
            <>
              <Link to="/events" className="nav-link">
                Events
              </Link>

              {isOrganizer && (
                <>
                  <Link to="/organizer/events" className="nav-link">
                    My Events
                  </Link>
                  <Link to="/organizer/create-event" className="nav-link">
                    Create
                  </Link>
                </>
              )}

              {isAttendee && (
                <Link to="/attendee/registered-events" className="nav-link">
                  My Events
                </Link>
              )}

              <Link to="/profile" className="nav-link">
                Profile
              </Link>

              {/* Clean User Section */}
              <div className="flex items-center space-x-3 pl-6 border-l border-slate-200">
                <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-600">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors duration-200"
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="nav-link">
                Sign in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
