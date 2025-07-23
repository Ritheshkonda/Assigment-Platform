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
    type: String, // or mongoose.Schema.Types.ObjectId if contests are stored
  },
  fileUrl: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  remarks: String,
  marks: Number,
  status: {
    type: String,
    enum: ["pending", "reviewed"],
    default: "pending",
  },
});

module.exports = mongoose.model("Submission", submissionSchema);