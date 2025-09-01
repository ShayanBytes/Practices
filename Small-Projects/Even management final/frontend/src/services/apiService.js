import api from "./api";

export const authService = {

  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

 
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  
  getCurrentUser: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

export const eventService = {
  
  getAllEvents: async (params = {}) => {
    const response = await api.get("/events", { params });
    return response.data;
  },

 
  createEvent: async (eventData) => {
    const response = await api.post("/events", eventData);
    return response.data;
  },


  updateEvent: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

 
  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

 
  registerForEvent: async (id) => {
    const response = await api.post(`/events/${id}/register`);
    return response.data;
  },

  
  unregisterFromEvent: async (id) => {
    const response = await api.post(`/events/${id}/unregister`);
    return response.data;
  },

  
  getOrganizerEvents: async () => {
    const response = await api.get("/events/organizer/my-events");
    return response.data;
  },

  
  getEventRegistrations: async (id) => {
    const response = await api.get(`/events/${id}/registrations`);
    return response.data;
  },
};

export const userService = {};
