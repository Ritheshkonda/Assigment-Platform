// controllers/assignmentController.js

const Assignment = require("../models/Assignment");

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, difficulty, testCases } = req.body;

    const assignment = new Assignment({
      title,
      description,
      difficulty,
      deadline,
      createdBy: req.user.id,
      testCases,
    });

    await assignment.save();
    res.status(201).json({ msg: "Assignment created", assignment });
  } catch (err) {
    console.error("❌ Error creating assignment:", err);
    res.status(500).json({ msg: "Internal Server Error", error: err.message });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("createdBy", "name email role");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch assignments", error: err.message });
  }
};
