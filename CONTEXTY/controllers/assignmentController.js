// controllers/assignmentController.js

const Assignment = require("../models/Assignment");

exports.createAssignment = async (req, res) => {
  try {
    const { title, description, deadline, contestId } = req.body;

    if (req.user.role !== "teacher" && req.user.role !== "admin") {
      return res.status(403).json({ msg: "Unauthorized" });
    }

    const assignment = new Assignment({
      title,
      description,
      deadline,
      createdBy: req.user.id,
      contestId,
    });

    await assignment.save();
    res.status(201).json({ msg: "Assignment created", assignment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate("createdBy", "name email");
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
