import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { eventService } from "../../services/apiService";
import LoadingSpinner from "../../components/LoadingSpinner";

const EventRegistrationsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRegistrations();
  }, [id]);

  const fetchRegistrations = async () => {
    try {
      const response = await eventService.getEventRegistrations(id);
      setRegistrations(response);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load registrations");
      console.error("Error fetching registrations:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {error}
            </h3>
            <button
              onClick={() => navigate("/organizer/events")}
              className="btn btn-primary"
            >
              Back to My Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Event Registrations
          </h1>
        </div>

        <div className="card mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {registrations.eventTitle}
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {registrations.totalRegistrations}
              </div>
              <div className="text-sm text-blue-600">Total Registrations</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {registrations.maxAttendees}
              </div>
              <div className="text-sm text-green-600">Maximum Capacity</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  (registrations.totalRegistrations /
                    registrations.maxAttendees) *
                    100
                )}
                %
              </div>
              <div className="text-sm text-purple-600">Capacity Filled</div>
            </div>
          </div>
        </div>

        {registrations.attendees.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">👥</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No registrations yet
            </h3>
            <p className="text-gray-500">
              Registrations will appear here once people sign up for your event.
            </p>
          </div>
        ) : (
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">
              Registered Attendees ({registrations.attendees.length})
            </h3>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Location
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Interests
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                      Registered
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {registrations.attendees.map((attendee, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span className="text-primary-600 font-medium">
                              {attendee.user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {attendee.user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {attendee.user.email}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {attendee.user.location || "Not specified"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {attendee.user.interests?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {attendee.user.interests
                              .slice(0, 3)
                              .map((interest, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                                >
                                  {interest}
                                </span>
                              ))}
                            {attendee.user.interests.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{attendee.user.interests.length - 3} more
                              </span>
                            )}
                          </div>
                        ) : (
                          "None specified"
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(attendee.registeredAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Export Options */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Total: {registrations.attendees.length} attendees
                </p>
                <button
                  onClick={() => {
                    // Simple CSV export
                    const csvContent = [
                      ["Name", "Email", "Location", "Interests", "Registered"],
                      ...registrations.attendees.map((attendee) => [
                        attendee.user.name,
                        attendee.user.email,
                        attendee.user.location || "",
                        attendee.user.interests?.join("; ") || "",
                        formatDate(attendee.registeredAt),
                      ]),
                    ]
                      .map((row) => row.map((cell) => `"${cell}"`).join(","))
                      .join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `${registrations.eventTitle}-registrations.csv`;
                    a.click();
                  }}
                  className="btn btn-secondary text-sm"
                >
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventRegistrationsPage;
