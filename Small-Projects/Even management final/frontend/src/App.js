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

// Working Pages
import WorkingLoginPage from "./pages/WorkingLoginPage";
import SimpleRegisterPage from "./pages/SimpleRegisterPage";
import HomePage from "./pages/HomePage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import EventsPage from "./pages/EventsPage";
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
  const hideOn = ["/login", "/register", "/"];
  if (hideOn.includes(location.pathname)) return null;
  return <Navbar />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <NavbarRenderer />
          <Routes>
            {/* Public Routes - Login/Register First */}
            <Route path="/" element={<WorkingLoginPage />} />
            <Route path="/login" element={<WorkingLoginPage />} />
            <Route path="/register" element={<SimpleRegisterPage />} />

            {/* Protected Routes - After Authentication */}
            <Route
              path="/home"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events"
              element={
                <ProtectedRoute>
                  <EventsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

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
                    <a href="/home" className="btn btn-primary">
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
