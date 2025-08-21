import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/apiService";

const WorkingLoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const from = location.state?.from?.pathname;

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from || "/home", { replace: true });
    }
  }, [isAuthenticated, from, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login(formData);
      login(response.user, response.token);
      navigate(from || "/home", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Clean Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
              <span className="text-white font-semibold text-sm">E</span>
            </div>
            <span className="text-xl font-semibold text-slate-900">
              EventHub
            </span>
          </div>
          <h1 className="heading-lg">Welcome back</h1>
          <p className="text-body mt-2">Sign in to your account</p>
        </div>

        {/* Clean Messages */}
        {location.state?.justRegistered && (
          <div className="status-success mb-6 text-center">
            Registration successful! Please sign in to continue.
          </div>
        )}

        {error && <div className="status-error mb-6 text-center">{error}</div>}

        {/* Clean Form */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-group">
              <label className="form-label">Email address</label>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>

        {/* Clean Sign Up Link */}
        <div className="text-center">
          <span className="text-small text-slate-500">
            Don't have an account?
          </span>
          <Link
            to="/register"
            className="text-small font-medium text-slate-900 hover:text-slate-700 ml-1"
          >
            Create one
          </Link>
        </div>

        {/* Demo Accounts */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <p className="text-small text-slate-500 text-center mb-4">
            Demo accounts for testing:
          </p>
          <div className="space-y-3">
            <div className="bg-slate-100 rounded-lg p-3">
              <div className="text-small font-medium text-slate-700 mb-1">
                Event Organizer
              </div>
              <div className="text-small text-slate-600">
                org@demo.com / password123
              </div>
            </div>
            <div className="bg-slate-100 rounded-lg p-3">
              <div className="text-small font-medium text-slate-700 mb-1">
                Event Attendee
              </div>
              <div className="text-small text-slate-600">
                attendee@demo.com / password123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkingLoginPage;
