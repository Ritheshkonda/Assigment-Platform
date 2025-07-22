// models/Assignment.js

const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  deadline: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // must be a teacher/admin user
    required: true,
  },
  contestId: {
    type: String, // optional for contest context
  },
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);
