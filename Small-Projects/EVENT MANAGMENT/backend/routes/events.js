import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { authenticateToken } from "../middleware/auth.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Path to events data file
const eventsDataPath = path.join(__dirname, "../data/events.json");
const registrationsDataPath = path.join(
  __dirname,
  "../data/registrations.json"
);

// Helper function to read events data
const readEventsData = () => {
  try {
    if (!fs.existsSync(eventsDataPath)) {
      fs.writeFileSync(eventsDataPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(eventsDataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write events data
const writeEventsData = (events) => {
  try {
    fs.writeFileSync(eventsDataPath, JSON.stringify(events, null, 2));
  } catch (error) {
    console.error("Error writing events data:", error);
  }
};

// Helper function to read registrations data
const readRegistrationsData = () => {
  try {
    if (!fs.existsSync(registrationsDataPath)) {
      fs.writeFileSync(registrationsDataPath, JSON.stringify([]));
    }
    const data = fs.readFileSync(registrationsDataPath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

// Helper function to write registrations data
const writeRegistrationsData = (registrations) => {
  try {
    fs.writeFileSync(
      registrationsDataPath,
      JSON.stringify(registrations, null, 2)
    );
  } catch (error) {
    console.error("Error writing registrations data:", error);
  }
};

// Create a new event (Organizer only)
router.post("/create", authenticateToken, (req, res) => {
  try {
    const {
      title,
      description,
      date,
      time,
      location,
      capacity,
      category,
      isPublic,
    } = req.body;

    // Check if user is an organizer
    if (req.user.role !== "organizer") {
      return res
        .status(403)
        .json({ message: "Only organizers can create events" });
    }

    // Validate required fields
    if (!title || !description || !date || !time || !location) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields" });
    }

    const events = readEventsData();

    const newEvent = {
      id: Date.now().toString(),
      title,
      description,
      date,
      time,
      location,
      capacity: capacity || null,
      category: category || "General",
      isPublic: isPublic !== false, // Default to true
      organizerId: req.user.id,
      organizerName: req.user.name,
      organizerEmail: req.user.email,
      createdAt: new Date().toISOString(),
      registeredAttendees: 0,
      status: "active",
    };

    events.push(newEvent);
    writeEventsData(events);

    res.status(201).json({
      message: "Event created successfully",
      event: newEvent,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all events for organizer
router.get("/my-events", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "organizer") {
      return res
        .status(403)
        .json({ message: "Only organizers can access this endpoint" });
    }

    const events = readEventsData();
    const myEvents = events.filter(
      (event) => event.organizerId === req.user.id
    );

    // Add registration count for each event
    const registrations = readRegistrationsData();
    const eventsWithRegistrations = myEvents.map((event) => ({
      ...event,
      registeredAttendees: registrations.filter(
        (reg) => reg.eventId === event.id
      ).length,
    }));

    res.json(eventsWithRegistrations);
  } catch (error) {
    console.error("Error fetching organizer events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all public events (for attendees)
router.get("/public", authenticateToken, (req, res) => {
  try {
    const events = readEventsData();
    const publicEvents = events.filter(
      (event) => event.isPublic && event.status === "active"
    );

    // Add registration count for each event
    const registrations = readRegistrationsData();
    const eventsWithRegistrations = publicEvents.map((event) => ({
      ...event,
      registeredAttendees: registrations.filter(
        (reg) => reg.eventId === event.id
      ).length,
    }));

    res.json(eventsWithRegistrations);
  } catch (error) {
    console.error("Error fetching public events:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Register for an event (Attendee only)
router.post("/register/:eventId", authenticateToken, (req, res) => {
  try {
    const { eventId } = req.params;

    if (req.user.role !== "attendee") {
      return res
        .status(403)
        .json({ message: "Only attendees can register for events" });
    }

    const events = readEventsData();
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (!event.isPublic || event.status !== "active") {
      return res
        .status(400)
        .json({ message: "This event is not available for registration" });
    }

    const registrations = readRegistrationsData();

    // Check if already registered
    const existingRegistration = registrations.find(
      (reg) => reg.eventId === eventId && reg.attendeeId === req.user.id
    );

    if (existingRegistration) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    // Check capacity
    const currentRegistrations = registrations.filter(
      (reg) => reg.eventId === eventId
    ).length;
    if (event.capacity && currentRegistrations >= event.capacity) {
      return res.status(400).json({ message: "Event is at full capacity" });
    }

    const newRegistration = {
      id: Date.now().toString(),
      eventId,
      attendeeId: req.user.id,
      attendeeName: req.user.name,
      attendeeEmail: req.user.email,
      registeredAt: new Date().toISOString(),
      status: "confirmed",
    };

    registrations.push(newRegistration);
    writeRegistrationsData(registrations);

    res.status(201).json({
      message: "Successfully registered for event",
      registration: newRegistration,
    });
  } catch (error) {
    console.error("Error registering for event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get registered events for attendee
router.get("/my-registrations", authenticateToken, (req, res) => {
  try {
    if (req.user.role !== "attendee") {
      return res
        .status(403)
        .json({ message: "Only attendees can access this endpoint" });
    }

    const registrations = readRegistrationsData();
    const myRegistrations = registrations.filter(
      (reg) => reg.attendeeId === req.user.id
    );

    const events = readEventsData();
    const registeredEvents = myRegistrations
      .map((registration) => {
        const event = events.find((e) => e.id === registration.eventId);
        return {
          ...event,
          registrationId: registration.id,
          registeredAt: registration.registeredAt,
          registrationStatus: registration.status,
        };
      })
      .filter((event) => event.id); // Filter out any null events

    res.json(registeredEvents);
  } catch (error) {
    console.error("Error fetching attendee registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get event registrations (Organizer only)
router.get("/registrations/:eventId", authenticateToken, (req, res) => {
  try {
    const { eventId } = req.params;

    if (req.user.role !== "organizer") {
      return res
        .status(403)
        .json({ message: "Only organizers can view event registrations" });
    }

    const events = readEventsData();
    const event = events.find((e) => e.id === eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizerId !== req.user.id) {
      return res
        .status(403)
        .json({
          message: "You can only view registrations for your own events",
        });
    }

    const registrations = readRegistrationsData();
    const eventRegistrations = registrations.filter(
      (reg) => reg.eventId === eventId
    );

    res.json({
      event: {
        id: event.id,
        title: event.title,
        date: event.date,
        capacity: event.capacity,
      },
      registrations: eventRegistrations,
      totalRegistrations: eventRegistrations.length,
    });
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Cancel registration (Attendee only)
router.delete("/cancel/:registrationId", authenticateToken, (req, res) => {
  try {
    const { registrationId } = req.params;

    if (req.user.role !== "attendee") {
      return res
        .status(403)
        .json({ message: "Only attendees can cancel registrations" });
    }

    const registrations = readRegistrationsData();
    const registrationIndex = registrations.findIndex(
      (reg) => reg.id === registrationId && reg.attendeeId === req.user.id
    );

    if (registrationIndex === -1) {
      return res.status(404).json({ message: "Registration not found" });
    }

    registrations.splice(registrationIndex, 1);
    writeRegistrationsData(registrations);

    res.json({ message: "Registration cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
