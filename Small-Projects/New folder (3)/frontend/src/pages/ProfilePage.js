import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { userService } from "../services/apiService";
import LoadingSpinner from "../components/LoadingSpinner";

const ProfilePage = () => {
  const { user, isOrganizer } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    organizationName: "",
    contactInfo: {
      phone: "",
      website: "",
    },
    eventTypes: [],
    interests: [],
    location: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile();
      setProfile(response);
      setFormData({
        name: response.name || "",
        organizationName: response.organizationName || "",
        contactInfo: {
          phone: response.contactInfo?.phone || "",
          website: response.contactInfo?.website || "",
        },
        eventTypes: response.eventTypes || [],
        interests: response.interests || [],
        location: response.location || "",
      });
    } catch (err) {
      setError("Failed to load profile");
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleArrayChange = (name, value) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [name]: array,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await userService.updateProfile(formData);
      setProfile(response.user);
      setSuccess("Profile updated successfully!");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
    setSuccess("");
    // Reset form data to current profile values
    if (profile) {
      setFormData({
        name: profile.name || "",
        organizationName: profile.organizationName || "",
        contactInfo: {
          phone: profile.contactInfo?.phone || "",
          website: profile.contactInfo?.website || "",
        },
        eventTypes: profile.eventTypes || [],
        interests: profile.interests || [],
        location: profile.location || "",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        <div className="card">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>

              {isOrganizer ? (
                <>
                  <div>
                    <label className="form-label">Organization Name</label>
                    <input
                      type="text"
                      name="organizationName"
                      value={formData.organizationName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        name="contactInfo.phone"
                        value={formData.contactInfo.phone}
                        onChange={handleChange}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label className="form-label">Website</label>
                      <input
                        type="url"
                        name="contactInfo.website"
                        value={formData.contactInfo.website}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">
                      Event Types (comma separated)
                    </label>
                    <input
                      type="text"
                      defaultValue={formData.eventTypes.join(", ")}
                      onChange={(e) =>
                        handleArrayChange("eventTypes", e.target.value)
                      }
                      className="form-input"
                      placeholder="e.g., Conference, Workshop, Seminar"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="e.g., New York, NY"
                    />
                  </div>

                  <div>
                    <label className="form-label">
                      Interests (comma separated)
                    </label>
                    <input
                      type="text"
                      defaultValue={formData.interests.join(", ")}
                      onChange={(e) =>
                        handleArrayChange("interests", e.target.value)
                      }
                      className="form-input"
                      placeholder="e.g., Technology, Music, Sports"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn btn-primary"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="pb-6 border-b border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                    <span className="text-primary-600 text-2xl font-bold">
                      {profile.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {profile.name}
                    </h2>
                    <p className="text-gray-600 capitalize">{profile.role}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Email:
                    </span>
                    <p className="text-gray-800">{profile.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-600">
                      Member Since:
                    </span>
                    <p className="text-gray-800">
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Role Specific Info */}
              {isOrganizer ? (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Organizer Information
                  </h3>
                  <div className="space-y-3">
                    {profile.organizationName && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Organization:
                        </span>
                        <p className="text-gray-800">
                          {profile.organizationName}
                        </p>
                      </div>
                    )}

                    {profile.contactInfo?.phone && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Phone:
                        </span>
                        <p className="text-gray-800">
                          {profile.contactInfo.phone}
                        </p>
                      </div>
                    )}

                    {profile.contactInfo?.website && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Website:
                        </span>
                        <p className="text-gray-800">
                          <a
                            href={profile.contactInfo.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-600 hover:text-primary-700"
                          >
                            {profile.contactInfo.website}
                          </a>
                        </p>
                      </div>
                    )}

                    {profile.eventTypes?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Event Types:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.eventTypes.map((type, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                            >
                              {type}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Attendee Information
                  </h3>
                  <div className="space-y-3">
                    {profile.location && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Location:
                        </span>
                        <p className="text-gray-800">{profile.location}</p>
                      </div>
                    )}

                    {profile.interests?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Interests:
                        </span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {profile.interests.map((interest, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-primary-100 text-primary-700 text-sm rounded-full"
                            >
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {profile.registeredEvents?.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Registered Events:
                        </span>
                        <p className="text-gray-800">
                          {profile.registeredEvents.length} events
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
