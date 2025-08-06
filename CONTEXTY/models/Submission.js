const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignmentTitle: {
    type: String,
    required: true,
  },
  contestId: {
    type: String,
  },
  fileUrl: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  marks: {
    type: Number,
    default: 0,
  },
  remarks: {
    type: String,
    default: "",
  },
  verdicts: [
    {
      input: String,
      expectedOutput: String,
      actualOutput: String,
      passed: Boolean,
    },
  ],
  status: {
    type: String,
    enum: ["pending", "reviewed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Submission", submissionSchema);
