import React, { useState, useEffect } from "react";
import { authAPI, eventAPI } from "../services/api";
import EventForm from "./EventForm";
import EventCard from "./EventCard";

const Dashboard = ({ user, setUser }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showEventForm, setShowEventForm] = useState(false);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedEventRegistrations, setSelectedEventRegistrations] =
    useState(null);

  // Load events based on user role
  useEffect(() => {
    if (activeTab === "events" || activeTab === "myRegistrations") {
      loadEvents();
    }
  }, [activeTab, user.role]);

  const loadEvents = async () => {
    setIsLoading(true);
    try {
      if (user.role === "organizer") {
        const myEvents = await eventAPI.getMyEvents();
        console.log("Organizer events:", myEvents);
        setEvents(myEvents);
      } else if (activeTab === "events") {
        // Load all public events for attendees to browse
        console.log("Loading public events for attendee...");
        const publicEvents = await eventAPI.getPublicEvents();
        console.log("Public events received:", publicEvents);
        setEvents(publicEvents);
        // Also load registrations to check registration status
        const myRegistrations = await eventAPI.getMyRegistrations();
        console.log("My registrations:", myRegistrations);
        setRegistrations(myRegistrations);
      } else if (activeTab === "myRegistrations") {
        // Load only registered events for attendees
        const myRegistrations = await eventAPI.getMyRegistrations();
        console.log("My registrations for tab:", myRegistrations);
        setEvents(myRegistrations);
        setRegistrations(myRegistrations);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEventCreated = (newEvent) => {
    setEvents([newEvent, ...events]);
    setShowEventForm(false);
    setActiveTab("events");
  };

  const handleRegistrationChange = () => {
    loadEvents(); // Reload events to update registration status
  };

  const handleViewRegistrations = async (eventId) => {
    try {
      const registrationData = await eventAPI.getEventRegistrations(eventId);
      setSelectedEventRegistrations(registrationData);
    } catch (error) {
      console.error("Error loading registrations:", error);
    }
  };

  const handleLogout = () => {
    // Call logout API to clear token
    authAPI.logout();

    // Clear user state
    setUser(null);
  };

  const OrganizerProfile = () => {
    const totalEvents = events.length;
    const activeEvents = events.filter((event) => {
      const eventDate = new Date(`${event.date}T${event.time}`);
      return eventDate > new Date() && event.status === "active";
    }).length;
    const totalAttendees = events.reduce(
      (sum, event) => sum + (event.registeredAttendees || 0),
      0
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-blue-100">
                  {user.profile.organizationName || "Organization Name"}
                </p>
                <div className="flex items-center mt-2">
                  <span className="bg-blue-500/30 px-3 py-1 rounded-full text-sm">
                    Event Organizer
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Contact</p>
                      <p className="font-medium text-gray-800">
                        {user.profile.contactInfo || "Add contact info"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Specializations
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.profile.eventTypes &&
                  user.profile.eventTypes.length > 0 ? (
                    user.profile.eventTypes.map((type, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {type}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Add event types you organize
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Quick Stats
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Events</span>
                <span className="text-2xl font-bold text-blue-600">
                  {totalEvents}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active Events</span>
                <span className="text-2xl font-bold text-green-600">
                  {activeEvents}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Attendees</span>
                <span className="text-2xl font-bold text-purple-600">
                  {totalAttendees}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">
              Ready to get started?
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Create your first event and start building your audience.
            </p>
            <button
              onClick={() => {
                setShowEventForm(true);
                setActiveTab("events");
              }}
              className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors w-full"
            >
              Create Event
            </button>
          </div>
        </div>
      </div>
    );
  };

  const AttendeeProfile = () => {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-green-100">
                  {user.profile.location || "Add your location"}
                </p>
                <div className="flex items-center mt-2">
                  <span className="bg-green-500/30 px-3 py-1 rounded-full text-sm">
                    Event Attendee
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Personal Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{user.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-blue-600"
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
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-800">
                        {user.profile.location || "Add your location"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.profile.interests &&
                  user.profile.interests.length > 0 ? (
                    user.profile.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">
                      Add your interests to discover relevant events
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Events Summary Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              My Events
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Registered</span>
                <span className="text-2xl font-bold text-green-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Attended</span>
                <span className="text-2xl font-bold text-blue-600">0</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Upcoming</span>
                <span className="text-2xl font-bold text-purple-600">0</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Discover Events</h3>
            <p className="text-green-100 text-sm mb-4">
              Find exciting events based on your interests and location.
            </p>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition-colors w-full">
              Browse Events
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  EventHub
                </h1>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "overview"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab("events")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "events"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {user.role === "organizer"
                      ? "My Events"
                      : "Available Events"}
                  </button>
                  {user.role === "attendee" && (
                    <button
                      onClick={() => setActiveTab("myRegistrations")}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === "myRegistrations"
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      My Registrations
                    </button>
                  )}
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === "profile"
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Profile
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "overview" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 mt-2">
                {user.role === "organizer"
                  ? "Manage your events and grow your audience"
                  : "Discover and join amazing events in your area"}
              </p>
            </div>

            {user.role === "organizer" ? (
              <OrganizerProfile />
            ) : (
              <AttendeeProfile />
            )}
          </div>
        )}

        {activeTab === "events" && (
          <div>
            {showEventForm && user.role === "organizer" ? (
              <EventForm
                onEventCreated={handleEventCreated}
                onCancel={() => setShowEventForm(false)}
              />
            ) : selectedEventRegistrations ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Event Registrations
                    </h2>
                    <p className="text-gray-600">
                      {selectedEventRegistrations.event.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedEventRegistrations(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">
                        Total Registrations
                      </p>
                      <p className="text-2xl font-bold text-blue-700">
                        {selectedEventRegistrations.totalRegistrations}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">
                        Event Date
                      </p>
                      <p className="text-lg font-semibold text-green-700">
                        {new Date(
                          selectedEventRegistrations.event.date
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">
                        Capacity
                      </p>
                      <p className="text-lg font-semibold text-purple-700">
                        {selectedEventRegistrations.event.capacity ||
                          "Unlimited"}
                      </p>
                    </div>
                  </div>
                </div>

                {selectedEventRegistrations.registrations.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Attendee
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Registered
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedEventRegistrations.registrations.map(
                          (registration) => (
                            <tr key={registration.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {registration.attendeeName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {registration.attendeeEmail}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(
                                  registration.registeredAt
                                ).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                  {registration.status}
                                </span>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No registrations yet for this event.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.role === "organizer"
                      ? "My Events"
                      : "Available Events"}
                  </h2>
                  {user.role === "organizer" && !showEventForm && (
                    <button
                      onClick={() => setShowEventForm(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                    >
                      Create New Event
                    </button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : events.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {events.map((event) => {
                      // For attendees, check if they're registered for this event
                      const registration =
                        user.role === "attendee"
                          ? registrations.find((reg) => reg.id === event.id)
                          : null;

                      return (
                        <EventCard
                          key={event.id}
                          event={
                            registration
                              ? {
                                  ...event,
                                  registrationId: registration.registrationId,
                                }
                              : event
                          }
                          userRole={user.role}
                          onRegistrationChange={handleRegistrationChange}
                          onViewRegistrations={handleViewRegistrations}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
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
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {user.role === "organizer"
                          ? "No events created yet"
                          : "No events available"}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {user.role === "organizer"
                          ? "Start creating events to connect with your audience"
                          : "Check back later for new events in your area"}
                      </p>
                      {user.role === "organizer" && (
                        <button
                          onClick={() => setShowEventForm(true)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                        >
                          Create Your First Event
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === "myRegistrations" && user.role === "attendee" && (
          <div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                My Registrations
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : events.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={{
                        ...event,
                        registrationId: event.registrationId,
                      }}
                      userRole={user.role}
                      onRegistrationChange={handleRegistrationChange}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
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
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No registered events
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You haven't registered for any events yet. Browse available
                    events to get started!
                  </p>
                  <button
                    onClick={() => setActiveTab("events")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Browse Events
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Profile Settings
            </h2>
            <p className="text-gray-500">
              Profile editing functionality coming soon...
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
