// routes/assignmentRoutes.js

const express = require("express");
const router = express.Router();
const { createAssignment, getAllAssignments } = require("../controllers/assignmentController");
const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// Only teacher or admin can create assignment
router.post("/create", authMiddleware, requireRole("teacher", "admin"), createAssignment);

// All authenticated users can view assignments
router.get("/all", authMiddleware, getAllAssignments);

module.exports = router;
