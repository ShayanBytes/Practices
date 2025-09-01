import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/apiService";

const SimpleRegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "attendee",
  
    organizationName: "",
    contactInfo: {
      phone: "",
      website: "",
    },
    eventTypes: [],
   
    interests: [],
    location: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phone" || name === "website") {
      setFormData((prev) => ({
        ...prev,
        contactInfo: {
          ...prev.contactInfo,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
     
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === "organizer") {
        registrationData.organizationName = formData.organizationName;
        registrationData.contactInfo = formData.contactInfo;
       
        if (formData.eventTypes.length > 0) {
          registrationData.eventTypes = formData.eventTypes;
        }
      } else if (formData.role === "attendee") {
        if (formData.location) {
          registrationData.location = formData.location;
        }
       
        if (formData.interests.length > 0) {
          registrationData.interests = formData.interests;
        }
      }

      await authService.register(registrationData);
      navigate("/login", {
        state: {
          justRegistered: true,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">E</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">
              EventHub
            </span>
          </div>
          <h1 className="heading-lg">Create Account</h1>
          <p className="text-body mt-2">Join EventHub today</p>
        </div>

        {error && <div className="status-error mb-6 text-center">{error}</div>}

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                required
                placeholder="Enter your password"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
              >
                <option value="attendee">Event Attendee</option>
                <option value="organizer">Event Organizer</option>
              </select>
            </div>

            {}
            {formData.role === "organizer" && (
              <>
                <div className="form-group">
                  <label className="form-label">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="form-input"
                    required
                    placeholder="Enter your organization name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.contactInfo.phone}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Website (optional)</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.contactInfo.website}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your website URL"
                  />
                </div>
              </>
            )}

            {}
            {formData.role === "attendee" && (
              <>
                <div className="form-group">
                  <label className="form-label">Location (optional)</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter your city or location"
                  />
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>
        </div>

        <div className="text-center">
          <span className="text-small text-slate-500">
            Already have an account?
          </span>
          <Link
            to="/login"
            className="text-small font-medium text-slate-900 hover:text-slate-700 ml-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SimpleRegisterPage;
