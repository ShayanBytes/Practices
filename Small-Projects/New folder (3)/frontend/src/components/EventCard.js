import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EventCard = ({
  event,
  showRegistrationButton = true,
  onRegister,
  onUnregister,
}) => {
  const { isAttendee, user } = useAuth();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isRegistered = event.attendees?.some(
    (attendee) => attendee.user === user?.id || attendee.user._id === user?.id
  );

  const isFull = event.currentAttendees >= event.maxAttendees;

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-2">{event.description}</p>
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            event.status === "upcoming"
              ? "bg-green-100 text-green-800"
              : event.status === "ongoing"
              ? "bg-yellow-100 text-yellow-800"
              : event.status === "completed"
              ? "bg-gray-100 text-gray-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {event.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Date:</span>
          <span className="ml-2">
            {formatDate(event.date)} at {event.time}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Location:</span>
          <span className="ml-2">{event.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Type:</span>
          <span className="ml-2">{event.eventType}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Organizer:</span>
          <span className="ml-2">
            {event.organizer?.organizationName || event.organizer?.name}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium">Capacity:</span>
          <span className="ml-2">
            {event.currentAttendees} / {event.maxAttendees}
            {isFull && <span className="text-red-600 ml-1">(Full)</span>}
          </span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Link
          to={`/events/${event._id}`}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          View Details
        </Link>

        {isAttendee && showRegistrationButton && (
          <div>
            {isRegistered ? (
              <button
                onClick={() => onUnregister && onUnregister(event._id)}
                className="btn bg-red-600 text-white hover:bg-red-700"
              >
                Unregister
              </button>
            ) : (
              <button
                onClick={() => onRegister && onRegister(event._id)}
                disabled={isFull}
                className={`btn ${
                  isFull
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "btn-primary"
                }`}
              >
                {isFull ? "Full" : "Register"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
