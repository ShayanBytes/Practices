import React, { useState, useEffect } from "react";
import { eventService } from "../services/apiService";
import { useAuth } from "../context/AuthContext";
import EventCard from "../components/EventCard";
import LoadingSpinner from "../components/LoadingSpinner";

const EventsPage = () => {
  const { isAttendee } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    eventType: "",
    location: "",
    date: "",
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        ...filters,
        page,
        limit: 12,
      };

      // Remove empty filters
      Object.keys(params).forEach((key) => {
        if (params[key] === "") delete params[key];
      });

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

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      eventType: "",
      location: "",
      date: "",
    });
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
            <LoadingSpinner size="large" />
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

          {/* Filters */}
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Filter Events</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="form-label">Event Type</label>
                <input
                  type="text"
                  name="eventType"
                  value={filters.eventType}
                  onChange={handleFilterChange}
                  placeholder="e.g., Conference, Workshop"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={filters.location}
                  onChange={handleFilterChange}
                  placeholder="e.g., New York"
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label">Date</label>
                <input
                  type="date"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="form-input"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="btn btn-secondary w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

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
              Try adjusting your filters or check back later.
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
