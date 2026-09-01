const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches the current, fresh user document to req.user.
// Re-reading the user from the DB (rather than trusting only the token
// payload) ensures a deactivated/rejected account loses access immediately.
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized, user no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid or expired" });
  }
};

// Blocks pending/rejected/deactivated accounts from protected routes,
// even if they somehow hold a valid token.
const requireActive = (req, res, next) => {
  if (req.user.status !== "active") {
    return res.status(403).json({
      message: `Access denied. Your account status is "${req.user.status}".`,
    });
  }
  next();
};

module.exports = { protect, requireActive };
