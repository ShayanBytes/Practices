import React, { useState } from "react";
import { eventAPI } from "../services/api";

const EventCard = ({
  event,
  userRole,
  onRegistrationChange,
  onViewRegistrations,
}) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const isEventPast = () => {
    const eventDateTime = new Date(`${event.date}T${event.time}`);
    return eventDateTime < new Date();
  };

  const isCapacityFull = () => {
    return event.capacity && event.registeredAttendees >= event.capacity;
  };

  const handleRegister = async () => {
    setIsRegistering(true);
    setError("");

    try {
      await eventAPI.registerForEvent(event.id);
      onRegistrationChange && onRegistrationChange();
    } catch (error) {
      setError(error.message || "Failed to register for event");
    } finally {
      setIsRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your registration for this event?"
      )
    ) {
      return;
    }

    setIsRegistering(true);
    setError("");

    try {
      await eventAPI.cancelRegistration(event.registrationId);
      onRegistrationChange && onRegistrationChange();
    } catch (error) {
      setError(error.message || "Failed to cancel registration");
    } finally {
      setIsRegistering(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technology: "bg-blue-100 text-blue-800",
      Business: "bg-green-100 text-green-800",
      Education: "bg-purple-100 text-purple-800",
      Entertainment: "bg-pink-100 text-pink-800",
      Sports: "bg-orange-100 text-orange-800",
      "Arts & Culture": "bg-indigo-100 text-indigo-800",
      "Health & Wellness": "bg-emerald-100 text-emerald-800",
      Networking: "bg-cyan-100 text-cyan-800",
      Conference: "bg-violet-100 text-violet-800",
      Workshop: "bg-amber-100 text-amber-800",
      Seminar: "bg-rose-100 text-rose-800",
      General: "bg-gray-100 text-gray-800",
    };
    return colors[category] || colors["General"];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                  event.category
                )}`}
              >
                {event.category}
              </span>
              {isEventPast() && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                  Past Event
                </span>
              )}
              {isCapacityFull() && !isEventPast() && (
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                  Full
                </span>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {event.title}
            </h3>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {event.description}
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-3 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">{formatDate(event.date)}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{formatTime(event.time)}</span>
          </div>

          <div className="flex items-center space-x-3 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.location}</span>
          </div>

          {event.capacity && (
            <div className="flex items-center space-x-3 text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>
                {event.registeredAttendees} / {event.capacity} attendees
              </span>
            </div>
          )}

          {!event.capacity && (
            <div className="flex items-center space-x-3 text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>{event.registeredAttendees} attendees</span>
            </div>
          )}
        </div>

        {userRole === "organizer" && (
          <div className="text-sm text-gray-500 mb-4">
            <p>Organized by you</p>
          </div>
        )}

        {userRole === "attendee" && event.organizerName && (
          <div className="text-sm text-gray-500 mb-4">
            <p>Organized by {event.organizerName}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3">
          {userRole === "attendee" && !event.registrationId && (
            <button
              onClick={handleRegister}
              disabled={isRegistering || isEventPast() || isCapacityFull()}
              className="flex-1 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Registering...
                </div>
              ) : isEventPast() ? (
                "Event Ended"
              ) : isCapacityFull() ? (
                "Event Full"
              ) : (
                "Register"
              )}
            </button>
          )}

          {userRole === "attendee" && event.registrationId && (
            <div className="flex space-x-2">
              <div className="flex-1 bg-green-100 text-green-800 px-4 py-3 rounded-lg font-medium text-center">
                ✓ Registered
              </div>
              <button
                onClick={handleCancelRegistration}
                disabled={isRegistering || isEventPast()}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRegistering ? "Canceling..." : "Cancel"}
              </button>
            </div>
          )}

          {userRole === "organizer" && (
            <button
              onClick={() =>
                onViewRegistrations && onViewRegistrations(event.id)
              }
              className="flex-1 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
            >
              View Registrations ({event.registeredAttendees})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCard;
