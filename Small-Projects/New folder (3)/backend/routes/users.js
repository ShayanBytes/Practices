const express = require("express");
const User = require("../models/User");
const Event = require("../models/Event");
const { auth, attendee } = require("../middleware/auth");

const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("registeredEvents", "title date time location organizer")
      .populate({
        path: "registeredEvents",
        populate: {
          path: "organizer",
          select: "name organizationName",
        },
      });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const allowedUpdates = [
      "name",
      "organizationName",
      "contactInfo",
      "eventTypes",
      "interests",
      "location",
    ];
    const updates = {};

    // Filter only allowed updates
    Object.keys(req.body).forEach((key) => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    res.json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get user's registered events (attendee only)
router.get("/registered-events", [auth, attendee], async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "registeredEvents",
      populate: {
        path: "organizer",
        select: "name organizationName email contactInfo",
      },
    });

    res.json({
      registeredEvents: user.registeredEvents,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
