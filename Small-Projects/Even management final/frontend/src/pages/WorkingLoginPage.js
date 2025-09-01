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
        {}
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

        {}
        {location.state?.justRegistered && (
          <div className="status-success mb-6 text-center">
            Registration successful! Please sign in to continue.
          </div>
        )}

        {error && <div className="status-error mb-6 text-center">{error}</div>}

        {}
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

        {}
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

       
        </div>
      </div>
  
  );
};

export default WorkingLoginPage;
