// ✅ routes/assignmentRoutes.js
const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAllAssignments,
  updateAssignment,
  deleteAssignment
} = require("../controllers/assignmentController");

const { authMiddleware, requireRole } = require("../middleware/authMiddleware");

// Routes
router.post("/create", authMiddleware, requireRole("teacher", "admin"), createAssignment);
router.get("/all", authMiddleware, getAllAssignments);
router.put("/update/:id", authMiddleware, requireRole("teacher", "admin"), updateAssignment);
router.delete("/delete/:id", authMiddleware, requireRole("teacher", "admin"), deleteAssignment);

module.exports = router;
