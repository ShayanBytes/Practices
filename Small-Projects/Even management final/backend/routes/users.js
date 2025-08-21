const express = require("express");
const User = require("../models/User");
const Event = require("../models/Event");
const { auth, attendee } = require("../middleware/auth");

const router = express.Router();

module.exports = router;
