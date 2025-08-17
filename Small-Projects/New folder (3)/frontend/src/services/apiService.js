import api from "./api";

export const authService = {
  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const eventService = {
  // Get all events
  getAllEvents: async (params = {}) => {
    const response = await api.get("/events", { params });
    return response.data;
  },

  // Get event by ID
  getEventById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Create event (organizer only)
  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },

  // Update event (organizer only)
  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  // Delete event (organizer only)
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Register for event (attendee only)
  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },

  // Unregister from event (attendee only)
  unregisterFromEvent: async (id) => {
    const response = await api.post(`/events/${id}/unregister`);
    return response.data;
  },

  // Get organizer's events
  getOrganizerEvents: async () => {
    const response = await api.get("/events/organizer/my-events");
    return response.data;
  },

  // Get event registrations (organizer only)
  getEventRegistrations: async (id) => {
    const response = await api.get(`/events/${id}/registrations`);
    return response.data;
  },
};

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get("/users/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("/users/profile", profileData);
    return response.data;
  },

  // Get registered events (attendee only)
  getRegisteredEvents: async () => {
    const response = await api.get("/users/registered-events");
    return response.data;
  },
};
