import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const DashboardPage = () => {
  const { user, isOrganizer, isAttendee } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container-clean section-clean">
        {/* Clean Welcome Section */}
        <div className="mb-12">
          <h1 className="heading-xl mb-3">Welcome back, {user.name}</h1>
          <p className="text-body">
            Manage your events and discover new opportunities
          </p>
        </div>

        {/* Clean Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Browse Events */}
          <Link to="/events" className="group">
            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                  <svg
                    className="w-6 h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="heading-md mb-2">Browse Events</h3>
                  <p className="text-small">
                    Discover events happening around you
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Organizer Actions */}
          {isOrganizer && (
            <>
              <Link to="/organizer/create-event" className="group">
                <div className="card hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                      <svg
                        className="w-6 h-6 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="heading-md mb-2">Create Event</h3>
                      <p className="text-small">Organize a new event</p>
                    </div>
                  </div>
                </div>
              </Link>

              <Link to="/organizer/events" className="group">
                <div className="card hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                      <svg
                        className="w-6 h-6 text-slate-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="heading-md mb-2">My Events</h3>
                      <p className="text-small">Manage your organized events</p>
                    </div>
                  </div>
                </div>
              </Link>
            </>
          )}

          {/* Attendee Actions */}
          {isAttendee && (
            <Link to="/attendee/registered-events" className="group">
              <div className="card hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                    <svg
                      className="w-6 h-6 text-slate-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h2m6-6V7a2 2 0 00-2-2H9v10a2 2 0 002 2h6a2 2 0 002-2v-4a2 2 0 00-2-2h-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="heading-md mb-2">My Registrations</h3>
                    <p className="text-small">View your registered events</p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Profile */}
          <Link to="/profile" className="group">
            <div className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors duration-200">
                  <svg
                    className="w-6 h-6 text-slate-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="heading-md mb-2">Profile</h3>
                  <p className="text-small">Update your account settings</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Clean Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="text-2xl font-semibold text-slate-900 mb-1">
              {isOrganizer ? "Events Created" : "Events Attended"}
            </div>
            <div className="text-3xl font-bold text-slate-600">0</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-semibold text-slate-900 mb-1">
              Total Participants
            </div>
            <div className="text-3xl font-bold text-slate-600">0</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-semibold text-slate-900 mb-1">
              This Month
            </div>
            <div className="text-3xl font-bold text-slate-600">0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
