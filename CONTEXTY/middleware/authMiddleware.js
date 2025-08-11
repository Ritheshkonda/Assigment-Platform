const jwt = require("jsonwebtoken");

// Auth Middleware: verifies token and attaches user to req
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

  if (!token) return res.status(401).json({ msg: "No token, access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach { id, role } to request
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};

// Role Checker Middleware: restricts access to allowed roles
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ msg: "Access denied: insufficient role" });
    }
    next();
  };
};

module.exports = { authMiddleware, requireRole };
