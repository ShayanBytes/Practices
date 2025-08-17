import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAttendee, isOrganizer, user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      const response = await eventService.getEventById(id);
      setEvent(response);
    } catch (err) {
      setError("Failed to load event details");
      console.error("Error fetching event:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setActionLoading(true);
    try {
      await eventService.registerForEvent(id);
      fetchEvent(); // Refresh event data
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register for event");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUnregister = async () => {
    setActionLoading(true);
    try {
      await eventService.unregisterFromEvent(id);
      fetchEvent(); // Refresh event data
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unregister from event");
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error || "Event not found"}
            </h3>
            <button
              onClick={() => navigate("/events")}
              className="btn btn-primary"
            >
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRegistered = event.attendees?.some(
    (attendee) =>
      attendee.user._id === user?.id || attendee.user._id === user?._id
  );
  const isFull = event.currentAttendees >= event.maxAttendees;
  const isOwner = event.organizer._id === user?.id;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back
          </button>
        </div>

        <div className="card">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {event.title}
              </h1>
              <div className="flex items-center space-x-4">
                <span
                  className={`px-3 py-1 text-sm rounded-full ${
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
                <span className="text-sm text-gray-600">
                  Created {new Date(event.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {isOrganizer && isOwner && (
                <>
                  <button
                    onClick={() => navigate(`/organizer/events/${id}/edit`)}
                    className="btn btn-secondary"
                  >
                    Edit Event
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/organizer/events/${id}/registrations`)
                    }
                    className="btn btn-secondary"
                  >
                    View Registrations ({event.currentAttendees})
                  </button>
                </>
              )}

              {isAttendee && !isOwner && (
                <div>
                  {isRegistered ? (
                    <button
                      onClick={handleUnregister}
                      disabled={actionLoading}
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      {actionLoading ? "Unregistering..." : "Unregister"}
                    </button>
                  ) : (
                    <button
                      onClick={handleRegister}
                      disabled={actionLoading || isFull}
                      className={`btn ${
                        isFull
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "btn-primary"
                      }`}
                    >
                      {actionLoading
                        ? "Registering..."
                        : isFull
                        ? "Event Full"
                        : "Register"}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Event Details */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="space-y-6">
              {/* Event Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Event Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">📅</span>
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">🕒</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">📍</span>
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">🏷️</span>
                    <span>{event.eventType}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-600 w-16">👥</span>
                    <span>
                      {event.currentAttendees} / {event.maxAttendees} attendees
                    </span>
                  </div>
                </div>
              </div>

              {/* Organizer Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Organizer</h3>
                <div className="space-y-2">
                  <p className="font-medium">
                    {event.organizer.organizationName || event.organizer.name}
                  </p>
                  <p className="text-gray-600">{event.organizer.email}</p>
                  {event.organizer.contactInfo?.phone && (
                    <p className="text-gray-600">
                      📞 {event.organizer.contactInfo.phone}
                    </p>
                  )}
                  {event.organizer.contactInfo?.website && (
                    <p className="text-gray-600">
                      🌐{" "}
                      <a
                        href={event.organizer.contactInfo.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {event.organizer.contactInfo.website}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              {/* Registration Status */}
              {isAttendee && (
                <div
                  className={`p-4 rounded-lg ${
                    isRegistered
                      ? "bg-green-50 border border-green-200"
                      : "bg-gray-50"
                  }`}
                >
                  <h3 className="font-semibold mb-2">Registration Status</h3>
                  <p
                    className={`text-sm ${
                      isRegistered ? "text-green-700" : "text-gray-600"
                    }`}
                  >
                    {isRegistered
                      ? "✅ You are registered for this event"
                      : "Not registered"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Attendees List (if registered or organizer) */}
          {(isRegistered || isOwner) && event.attendees?.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-4">
                Attendees ({event.attendees.length})
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {event.attendees.map((attendee, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-medium">
                        {attendee.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {attendee.user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        Registered{" "}
                        {new Date(attendee.registeredAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
