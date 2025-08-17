import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { userService, eventService } from "../../services/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";

const AttendeeRegisteredEventsPage = () => {
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirmEvent, setConfirmEvent] = useState(null); // event object to confirm unregister
  const [unregisteringId, setUnregisteringId] = useState(null);

  useEffect(() => {
    fetchRegisteredEvents();
  }, []);

  const fetchRegisteredEvents = async () => {
    try {
      const response = await userService.getRegisteredEvents();
      setRegisteredEvents(response.registeredEvents);
    } catch (err) {
      setError("Failed to load your registered events");
      console.error("Error fetching registered events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-dismiss success messages
  useEffect(() => {
    if (!success) return;
    const t = setTimeout(() => setSuccess(""), 4000);
    return () => clearTimeout(t);
  }, [success]);

  const openConfirm = (event) => setConfirmEvent(event);
  const closeConfirm = () => setConfirmEvent(null);

  const confirmUnregister = async () => {
    if (!confirmEvent) return;
    const eventId = confirmEvent._id;
    setError("");
    setUnregisteringId(eventId);
    try {
      await eventService.unregisterFromEvent(eventId);
      setRegisteredEvents((prev) => prev.filter((e) => e._id !== eventId));
      setSuccess(`Unregistered from "${confirmEvent.title}"`);
      setConfirmEvent(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to unregister from event"
      );
    } finally {
      setUnregisteringId(null);
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

  const getEventStatus = (eventDate) => {
    const now = new Date();
    const eventDateTime = new Date(eventDate);

    if (eventDateTime < now) {
      return { status: "completed", color: "bg-gray-100 text-gray-800" };
    } else if (eventDateTime.toDateString() === now.toDateString()) {
      return { status: "today", color: "bg-yellow-100 text-yellow-800" };
    } else {
      return { status: "upcoming", color: "bg-green-100 text-green-800" };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

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

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded mb-6 flex justify-between items-start">
            <span className="pr-4">{success}</span>
            <button
              onClick={() => setSuccess("")}
              className="text-green-800 font-bold"
            >
              ×
            </button>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {registeredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎫</div>
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
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="card bg-blue-50 border-blue-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {registeredEvents.length}
                  </div>
                  <div className="text-blue-600 font-medium">
                    Total Registered
                  </div>
                </div>
              </div>

              <div className="card bg-green-50 border-green-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {
                      registeredEvents.filter(
                        (event) =>
                          getEventStatus(event.date).status === "upcoming"
                      ).length
                    }
                  </div>
                  <div className="text-green-600 font-medium">
                    Upcoming Events
                  </div>
                </div>
              </div>

              <div className="card bg-gray-50 border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-600 mb-2">
                    {
                      registeredEvents.filter(
                        (event) =>
                          getEventStatus(event.date).status === "completed"
                      ).length
                    }
                  </div>
                  <div className="text-gray-600 font-medium">Past Events</div>
                </div>
              </div>
            </div>

            {/* Events List */}
            <div className="space-y-6">
              {registeredEvents.map((event) => {
                const eventStatus = getEventStatus(event.date);

                return (
                  <div key={event._id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="text-xl font-semibold text-gray-800 mr-3">
                            {event.title}
                          </h3>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${eventStatus.color}`}
                          >
                            {eventStatus.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium text-gray-800 mr-2">
                          📅
                        </span>
                        <div>
                          <div>{formatDate(event.date)}</div>
                          <div className="text-xs">{event.time}</div>
                        </div>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium text-gray-800 mr-2">
                          📍
                        </span>
                        <span>{event.location}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium text-gray-800 mr-2">
                          🏷️
                        </span>
                        <span>{event.eventType}</span>
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium text-gray-800 mr-2">
                          🏢
                        </span>
                        <span>
                          {event.organizer?.organizationName ||
                            event.organizer?.name}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <Link
                          to={`/events/${event._id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium"
                        >
                          View Details
                        </Link>

                        {event.organizer?.contactInfo?.email && (
                          <a
                            href={`mailto:${event.organizer.contactInfo.email}`}
                            className="text-primary-600 hover:text-primary-700 font-medium"
                          >
                            Contact Organizer
                          </a>
                        )}
                      </div>

                      {eventStatus.status !== "completed" && (
                        <button
                          onClick={() => openConfirm(event)}
                          disabled={unregisteringId === event._id}
                          className={`btn bg-red-600 text-white hover:bg-red-700 ${
                            unregisteringId === event._id
                              ? "opacity-70 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          {unregisteringId === event._id
                            ? "Unregistering..."
                            : "Unregister"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirm Unregister Modal */}
            {confirmEvent && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div
                  className="absolute inset-0 bg-black bg-opacity-50"
                  onClick={closeConfirm}
                />
                <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full mx-4 p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Unregister from event
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to unregister from{" "}
                    <span className="font-medium">{confirmEvent.title}</span>?
                    You may lose your spot.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={closeConfirm}
                      className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmUnregister}
                      className="btn bg-red-600 text-white hover:bg-red-700"
                    >
                      Yes, Unregister
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AttendeeRegisteredEventsPage;
