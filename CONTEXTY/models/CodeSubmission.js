// models/CodeSubmission.js

const mongoose = require("mongoose");

const codeSubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    enum: ["cpp", "python", "java", "js"], // Extend as needed
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "failed", "error"],
    default: "pending",
  },
  score: {
    type: Number,
    default: 0,
  },
  verdicts: [
    {
      input: String,
      expectedOutput: String,
      studentOutput: String,
      result: String, // e.g., "Accepted", "Wrong Answer"
    },
  ],
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CodeSubmission", codeSubmissionSchema);
