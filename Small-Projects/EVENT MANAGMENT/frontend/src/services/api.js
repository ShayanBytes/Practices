// API configuration
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Authentication API functions
export const authAPI = {
  // Register new user
  register: async (userData) => {
    return makeRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return makeRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return makeRequest("/auth/me");
  },

  // Logout (client-side)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// User API functions
export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return makeRequest("/users/profile");
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return makeRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  },
};

// Event API functions
export const eventAPI = {
  // Create a new event (Organizer only)
  createEvent: async (eventData) => {
    return makeRequest("/events/create", {
      method: "POST",
      body: JSON.stringify(eventData),
    });
  },

  // Get organizer's events
  getMyEvents: async () => {
    return makeRequest("/events/my-events");
  },

  // Get all public events
  getPublicEvents: async () => {
    return makeRequest("/events/public");
  },

  // Register for an event (Attendee only)
  registerForEvent: async (eventId) => {
    return makeRequest(`/events/register/${eventId}`, {
      method: "POST",
    });
  },

  // Get attendee's registered events
  getMyRegistrations: async () => {
    return makeRequest("/events/my-registrations");
  },

  // Get event registrations (Organizer only)
  getEventRegistrations: async (eventId) => {
    return makeRequest(`/events/registrations/${eventId}`);
  },

  // Cancel registration (Attendee only)
  cancelRegistration: async (registrationId) => {
    return makeRequest(`/events/cancel/${registrationId}`, {
      method: "DELETE",
    });
  },
};

// Token management
export const tokenUtils = {
  // Save token to localStorage
  saveToken: (token) => {
    localStorage.setItem("token", token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem("token");
  },

  // Remove token from localStorage
  removeToken: () => {
    localStorage.removeItem("token");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("token");
    return !!token;
  },
};

export default {
  authAPI,
  userAPI,
  eventAPI,
  tokenUtils,
};
