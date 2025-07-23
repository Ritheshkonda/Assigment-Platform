const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// Protected for logged-in users
router.get("/profile", authMiddleware, (req, res) => {
  res.json({ msg: "This is your profile", user: req.user });
});

// Only teacher or admin can access
router.get("/admin-area", authMiddleware, requireRole("teacher", "admin"), (req, res) => {
  res.json({ msg: "Welcome to teacher/admin panel", role: req.user.role });
});

module.exports = router;