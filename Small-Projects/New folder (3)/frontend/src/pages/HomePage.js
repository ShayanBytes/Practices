import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, isOrganizer, isAttendee } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-indigo-600" />
        <svg
          className="absolute bottom-0 left-0 w-full h-24 text-white opacity-10"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0 0h1200v120H0z" fill="currentColor" />
        </svg>
        <div className="relative py-20">
          <div className="max-w-5xl mx-auto px-4 text-center text-white">
            <span className="inline-block mb-4 px-4 py-1 rounded-full bg-white/20 text-sm tracking-wide">
              Plan • Discover • Connect
            </span>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Welcome to EventHub
            </h1>
            <p className="text-lg md:text-xl mb-10 opacity-90">
              Discover amazing events or organize your own. Bring people
              together around shared passions.
            </p>
            {!isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/register"
                  className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </Link>
                <Link
                  to="/events"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors"
                >
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to="/events"
                  className="bg-white text-primary-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Browse Events
                </Link>
                {isOrganizer && (
                  <Link
                    to="/organizer/create-event"
                    className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-700 transition-colors"
                  >
                    Create Event
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Everything you need to manage events
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* For Organizers */}
            <div className="card">
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-2xl font-semibold mb-4">For Organizers</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Create and manage events easily</li>
                  <li>• Track event registrations</li>
                  <li>• Manage attendee information</li>
                  <li>• Set event capacity and details</li>
                </ul>
                {!isAuthenticated && (
                  <Link
                    to="/register?role=organizer"
                    className="btn btn-primary mt-4 inline-block"
                  >
                    Become an Organizer
                  </Link>
                )}
              </div>
            </div>

            {/* For Attendees */}
            <div className="card">
              <div className="text-center">
                <div className="text-4xl mb-4">🎉</div>
                <h3 className="text-2xl font-semibold mb-4">For Attendees</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Discover interesting events</li>
                  <li>• Register for events instantly</li>
                  <li>• Track your event registrations</li>
                  <li>• Connect with like-minded people</li>
                </ul>
                {!isAuthenticated && (
                  <Link
                    to="/register?role=attendee"
                    className="btn btn-primary mt-4 inline-block"
                  >
                    Join as Attendee
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-4">Why EventHub?</h3>
              <p className="text-gray-600 mb-4">
                EventHub makes it simple to organize, promote, and attend events
                of all sizes. From intimate workshops to large conferences, we
                provide the tools to make your event a success.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>• Fast, intuitive event creation and management</li>
                <li>• Built-in registration tracking and capacity limits</li>
                <li>• Role-based access for organizers and attendees</li>
                <li>• Clean, responsive UI powered by Tailwind CSS</li>
              </ul>
            </div>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h4 className="text-xl font-semibold mb-3">Getting Started</h4>
              <ol className="list-decimal list-inside text-gray-700 space-y-1">
                <li>Create an account as an organizer or attendee</li>
                <li>Organizers: add your first event in minutes</li>
                <li>Attendees: browse and register for events</li>
                <li>Manage everything from your dashboard</li>
              </ol>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Links for Authenticated Users */}
      {isAuthenticated && (
        <div className="py-16 bg-gray-100">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Your Dashboard</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link
                to="/events"
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl mb-2">🎪</div>
                <h3 className="text-lg font-semibold">All Events</h3>
                <p className="text-gray-600">Browse and discover events</p>
              </Link>

              {isOrganizer && (
                <>
                  <Link
                    to="/organizer/events"
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-2">📊</div>
                    <h3 className="text-lg font-semibold">My Events</h3>
                    <p className="text-gray-600">Manage your events</p>
                  </Link>
                  <Link
                    to="/organizer/create-event"
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="text-4xl mb-2">➕</div>
                    <h3 className="text-lg font-semibold">Create Event</h3>
                    <p className="text-gray-600">Organize a new event</p>
                  </Link>
                </>
              )}

              {isAttendee && (
                <Link
                  to="/attendee/registered-events"
                  className="card hover:shadow-lg transition-shadow"
                >
                  <div className="text-4xl mb-2">🎫</div>
                  <h3 className="text-lg font-semibold">My Registrations</h3>
                  <p className="text-gray-600">View your registered events</p>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
