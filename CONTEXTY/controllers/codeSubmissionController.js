// controllers/codeSubmissionController.js

const CodeSubmission = require("../models/CodeSubmission");
const Assignment = require("../models/Assignment");

exports.submitCode = async (req, res) => {
  try {
    const { assignmentId, code, language } = req.body;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    let score = 0;
    const verdicts = [];

    // Simulate test case evaluation
    for (let testCase of assignment.testCases) {
      const { input, output: expectedOutput } = testCase;

      // ⚠️ Simulate response: Always accept (you can later integrate Judge0 or custom execution)
      const studentOutput = expectedOutput; // assume correct for now
      const result = studentOutput.trim() === expectedOutput.trim() ? "Accepted" : "Wrong Answer";

      if (result === "Accepted") score += testCase.marks || 10;

      verdicts.push({ input, expectedOutput, studentOutput, result });
    }

    const submission = new CodeSubmission({
      student: req.user.id,
      assignment: assignment._id,
      code,
      language,
      verdicts,
      score,
      status: "accepted", // hardcoded for now
    });

    await submission.save();
    res.status(201).json({ msg: "Code submitted", submission });
  } catch (err) {
    console.error("Code submission error:", err);
    res.status(500).json({ error: err.message });
  }
};
