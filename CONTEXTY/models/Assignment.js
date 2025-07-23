// models/Assignment.js

const mongoose = require("mongoose");

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: true,
  },
  output: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    default: 0,
  },
});

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    deadline: Date,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // must be a teacher/admin user
      required: true,
    },
    contestId: String,
    testCases: [testCaseSchema], // ✅ New field
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);
