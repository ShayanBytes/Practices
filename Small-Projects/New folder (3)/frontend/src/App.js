import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import ProfilePage from "./pages/ProfilePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

// Organizer Pages
import OrganizerEventsPage from "./pages/organizer/OrganizerEventsPage";
import CreateEventPage from "./pages/organizer/CreateEventPage";
import EventRegistrationsPage from "./pages/organizer/EventRegistrationsPage";

// Attendee Pages
import AttendeeRegisteredEventsPage from "./pages/attendee/AttendeeRegisteredEventsPage";

// Render Navbar on all routes except login/register
const NavbarRenderer = () => {
  const location = useLocation();
  const p = location.pathname;
  const hide = p === "/" || p.startsWith("/login") || p.startsWith("/register");
  if (hide) return null;
  return <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavbarRenderer />
          <Routes>
            {/* Public Routes */}
            {/* Make Login the default landing page */}
            <Route path="/" element={<LoginPage />} />
            {/* Optional: keep HomePage reachable explicitly */}
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id"
              element={
                <ProtectedRoute>
                  <EventDetailPage />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected Routes */}
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* Organizer Only Routes */}
            <Route
              path="/organizer/events"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <OrganizerEventsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/create-event"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <CreateEventPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/events/:id/registrations"
              element={
                <ProtectedRoute requiredRole="organizer">
                  <EventRegistrationsPage />
                </ProtectedRoute>
              }
            />

            {/* Attendee Only Routes */}
            <Route
              path="/attendee/registered-events"
              element={
                <ProtectedRoute requiredRole="attendee">
                  <AttendeeRegisteredEventsPage />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route
              path="*"
              element={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-6xl mb-4">🔍</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                      Page Not Found
                    </h1>
                    <p className="text-gray-600 mb-6">
                      The page you're looking for doesn't exist.
                    </p>
                    <a href="/" className="btn btn-primary">
                      Go Home
                    </a>
                  </div>
                </div>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
