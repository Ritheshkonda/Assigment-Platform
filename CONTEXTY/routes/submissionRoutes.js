const express = require("express");
const router = express.Router();
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");
const {
  submitAssignment,
  getMySubmissions,
  getAllSubmissions,
  evaluateSubmission // ✅ FIXED import
} = require("../controllers/submissionController");

// Student routes
router.post("/submit", authMiddleware, submitAssignment);
router.get("/my", authMiddleware, getMySubmissions);

// Faculty/Admin routes
router.get("/all", authMiddleware, requireRole("teacher", "admin"), getAllSubmissions);
router.put("/evaluate/:id", authMiddleware, requireRole("teacher", "admin"), evaluateSubmission);

module.exports = router;
