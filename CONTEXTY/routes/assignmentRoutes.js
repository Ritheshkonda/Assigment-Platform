// routes/assignmentRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  createAssignment,
  getAllAssignments,
} = require("../controllers/assignmentController");

router.post("/create", authMiddleware, createAssignment);
router.get("/all", authMiddleware, getAllAssignments);

module.exports = router;