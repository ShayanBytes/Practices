import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI, tokenUtils } from "../services/api";

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "attendee",
    organizationName: "",
    contactInfo: "",
    eventTypes: "",
    interests: "",
    location: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare user data for backend
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        profile:
          formData.role === "organizer"
            ? {
                organizationName: formData.organizationName,
                contactInfo: formData.contactInfo,
                eventTypes: formData.eventTypes
                  .split(",")
                  .map((type) => type.trim())
                  .filter((type) => type.length > 0),
              }
            : {
                interests: formData.interests
                  .split(",")
                  .map((interest) => interest.trim())
                  .filter((interest) => interest.length > 0),
                location: formData.location,
              },
      };

      // Call backend API for registration
      const response = await authAPI.register(userData);

      if (response.success) {
        // Save token to localStorage
        tokenUtils.saveToken(response.token);

        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(response.user));

        // Set user in state and redirect
        setUser(response.user);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden py-12">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gray-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-gray-400 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-gray-900/90 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-700/50 p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Join EventHub
            </h1>
            <p className="text-gray-300">
              Create your account and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Account Type *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white"
              >
                <option value="attendee">Attendee</option>
                <option value="organizer">Event Organizer</option>
              </select>
            </div>

            {formData.role === "organizer" && (
              <>
                <div>
                  <label
                    htmlFor="organizationName"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Organization Name
                  </label>
                  <input
                    type="text"
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                    placeholder="Your organization name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactInfo"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Contact Information
                  </label>
                  <input
                    type="text"
                    id="contactInfo"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                    placeholder="Phone number or additional contact"
                  />
                </div>

                <div>
                  <label
                    htmlFor="eventTypes"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Event Types (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="eventTypes"
                    name="eventTypes"
                    value={formData.eventTypes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                    placeholder="Conference, Workshop, Seminar"
                  />
                </div>
              </>
            )}

            {formData.role === "attendee" && (
              <>
                <div>
                  <label
                    htmlFor="interests"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Interests (comma-separated)
                  </label>
                  <input
                    type="text"
                    id="interests"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                    placeholder="Technology, Business, Arts"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-semibold text-gray-300 mb-2"
                  >
                    Location
                  </label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                    placeholder="Your city or region"
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Password *
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-300 mb-2"
              >
                Confirm Password *
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200 bg-gray-800/50 text-white placeholder-gray-400"
                placeholder="Confirm your password"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200 ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl"
              } text-white`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
