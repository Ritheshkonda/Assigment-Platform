// controllers/assignmentController.js

const Assignment = require("../models/Assignment");

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, contestId, difficulty, testCases } = req.body;

    // Optional role check if not handled via middleware
    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied: unauthorized role" });
    }

    const assignment = new Assignment({
      title,
      description,
      deadline,
      difficulty,
      testCases,
      createdBy: req.user.id,
      contestId,
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
exports.updateAssignment = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, deadline, difficulty, testCases } = req.body;

    const updated = await Assignment.findByIdAndUpdate(
      id,
      { title, description, deadline, difficulty, testCases },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    res.json({ msg: "Assignment updated", updated });
  } catch (err) {
    console.error("Error updating assignment:", err);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ msg: "Assignment not found" });
    }

    if (assignment.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Unauthorized to delete this assignment" });
    }

    await assignment.deleteOne();
    res.json({ msg: "Assignment deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete", error: err.message });
  }
};
