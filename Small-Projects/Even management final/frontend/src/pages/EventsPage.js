import React, { useState, useEffect } from "react";
import { eventService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";

const EventsPage = () => {
  const { isAttendee } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 12,
      };

      const response = await eventService.getAllEvents(params);
      setEvents(response.events);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
      });
    } catch (err) {
      setError("Failed to load events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await eventService.registerForEvent(eventId);
      fetchEvents(pagination.currentPage); // Refresh events
    } catch (err) {
      alert(err.response?.data?.message || "Failed to register for event");
    }
  };

  const handleUnregister = async (eventId) => {
    try {
      await eventService.unregisterFromEvent(eventId);
      fetchEvents(pagination.currentPage); // Refresh events
    } catch (err) {
      alert(err.response?.data?.message || "Failed to unregister from event");
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-600">Loading events...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">All Events</h1>

          {/* Results Summary */}
          <div className="mb-4">
            <p className="text-gray-600">
              Showing {events.length} of {pagination.total} events
            </p>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🎭</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No events found
            </h3>
            <p className="text-gray-500">
              Check back later for upcoming events.
            </p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  showRegistrationButton={isAttendee}
                  onRegister={handleRegister}
                  onUnregister={handleUnregister}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-8 space-x-2">
                <button
                  onClick={() => fetchEvents(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="btn btn-secondary"
                >
                  Previous
                </button>

                <span className="flex items-center px-4 py-2 text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => fetchEvents(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="btn btn-secondary"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
