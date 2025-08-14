import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Token is not valid",
    });
  }
};

// Middleware to check if user is organizer
export const requireOrganizer = (req, res, next) => {
  if (req.user.role !== "organizer") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Organizer role required.",
    });
  }
  next();
};

// Middleware to check if user is attendee
export const requireAttendee = (req, res, next) => {
  if (req.user.role !== "attendee") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Attendee role required.",
    });
  }
  next();
};
