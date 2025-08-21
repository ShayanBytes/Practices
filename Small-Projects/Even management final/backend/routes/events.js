const express = require("express");
const { body, validationResult } = require("express-validator");
const Event = require("../models/Event");
const User = require("../models/User");
const { auth, organizer, attendee } = require("../middleware/auth");

const router = express.Router();

// Get all public events
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, eventType, location, date } = req.query;

    let filter = { isPublic: true };

    if (eventType) filter.eventType = eventType;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const events = await Event.find(filter)
      .populate("organizer", "name organizationName email")
      .sort({ date: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Event.countDocuments(filter);

    res.json({
      events,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get event by ID
router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("organizer", "name organizationName email contactInfo")
      .populate("attendees.user", "name email");

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create event (organizer only)
router.post(
  "/",
  [
    auth,
    organizer,
    [
      body("title")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Title must be at least 3 characters"),
      body("description")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Description must be at least 10 characters"),
      body("eventType").trim().notEmpty().withMessage("Event type is required"),
      body("date").isISO8601().withMessage("Please provide a valid date"),
      body("time")
        .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
        .withMessage("Please provide valid time (HH:MM)"),
      body("location").trim().notEmpty().withMessage("Location is required"),
      body("maxAttendees")
        .isInt({ min: 1 })
        .withMessage("Max attendees must be at least 1"),
    ],
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const eventData = {
        ...req.body,
        organizer: req.user._id,
      };

      const event = new Event(eventData);
      await event.save();

      const populatedEvent = await Event.findById(event._id).populate(
        "organizer",
        "name organizationName email"
      );

      res.status(201).json({
        message: "Event created successfully",
        event: populatedEvent,
      });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Update event (organizer only, own events)
router.put("/:id", [auth, organizer], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Access denied. You can only edit your own events." });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("organizer", "name organizationName email");

    res.json({
      message: "Event updated successfully",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete event (organizer only, own events)
router.delete("/:id", [auth, organizer], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "Access denied. You can only delete your own events.",
        });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Remove event from users' registered events
    await User.updateMany(
      { registeredEvents: req.params.id },
      { $pull: { registeredEvents: req.params.id } }
    );

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Register for event (attendee only)
router.post("/:id/register", [auth, attendee], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.currentAttendees >= event.maxAttendees) {
      return res.status(400).json({ message: "Event is full" });
    }

    // Check if user is already registered
    const isRegistered = event.attendees.some(
      (attendee) => attendee.user.toString() === req.user._id.toString()
    );

    if (isRegistered) {
      return res
        .status(400)
        .json({ message: "You are already registered for this event" });
    }

    // Add user to event attendees
    event.attendees.push({ user: req.user._id });
    await event.updateAttendeesCount();

    // Add event to user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { registeredEvents: event._id },
    });

    res.json({ message: "Successfully registered for event" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Unregister from event (attendee only)
router.post("/:id/unregister", [auth, attendee], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Remove user from event attendees
    event.attendees = event.attendees.filter(
      (attendee) => attendee.user.toString() !== req.user._id.toString()
    );
    await event.updateAttendeesCount();

    // Remove event from user's registered events
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { registeredEvents: event._id },
    });

    res.json({ message: "Successfully unregistered from event" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get organizer's events
router.get("/organizer/my-events", [auth, organizer], async (req, res) => {
  try {
    const events = await Event.find({ organizer: req.user._id })
      .populate("attendees.user", "name email")
      .sort({ date: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get event registrations (organizer only, own events)
router.get("/:id/registrations", [auth, organizer], async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      "attendees.user",
      "name email interests location"
    );

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message:
            "Access denied. You can only view registrations for your own events.",
        });
    }

    res.json({
      eventTitle: event.title,
      totalRegistrations: event.attendees.length,
      maxAttendees: event.maxAttendees,
      attendees: event.attendees,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
