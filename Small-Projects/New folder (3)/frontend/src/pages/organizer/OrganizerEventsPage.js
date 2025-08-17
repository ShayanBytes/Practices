import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventService } from "../../services/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";

const OrganizerEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getOrganizerEvents();
      setEvents(response);
    } catch (err) {
      setError("Failed to load your events");
      console.error("Error fetching organizer events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await eventService.deleteEvent(eventId);
      setEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
          <Link to="/organizer/create-event" className="btn btn-primary">
            Create New Event
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No events created yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start by creating your first event!
            </p>
            <Link to="/organizer/create-event" className="btn btn-primary">
              Create Event
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            {events.map((event) => (
              <div key={event._id} className="card">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-2 line-clamp-2">
                      {event.description}
                    </p>
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
                    <span className="font-medium">Registrations:</span>
                    <span className="ml-2">
                      {event.currentAttendees} / {event.maxAttendees}
                      {event.currentAttendees >= event.maxAttendees && (
                        <span className="text-red-600 ml-1">(Full)</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="flex space-x-2">
                    <Link
                      to={`/events/${event._id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      View Details
                    </Link>
                    <Link
                      to={`/organizer/events/${event._id}/registrations`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      Registrations
                    </Link>
                  </div>

                  <div className="flex space-x-2">
                    <Link
                      to={`/organizer/events/${event._id}/edit`}
                      className="btn btn-secondary text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="btn btn-danger text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerEventsPage;
