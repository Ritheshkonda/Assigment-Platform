const Submission = require("../models/Submission");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentTitle, fileUrl, contestId } = req.body;

    const submission = new Submission({
      student: req.user.id,
      assignmentTitle,
      contestId,
      fileUrl,
    });

    await submission.save();
    res.status(201).json({ msg: "Submitted successfully", submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};