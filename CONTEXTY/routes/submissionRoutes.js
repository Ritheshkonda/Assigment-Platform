const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const {
  submitAssignment,
  getMySubmissions,
} = require("../controllers/submissionController");

router.post("/submit", authMiddleware, submitAssignment);
router.get("/my", authMiddleware, getMySubmissions);

module.exports = router;