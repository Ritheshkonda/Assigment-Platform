// routes/codeSubmissionRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { submitCode } = require("../controllers/codeSubmissionController");

router.post("/submit-code", authMiddleware, submitCode);

module.exports = router;
