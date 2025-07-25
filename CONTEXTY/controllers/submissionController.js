const Submission = require("../models/Submission");
const Assignment = require("../models/Assignment");

exports.submitAssignment = async (req, res) => {
  try {
    const { assignmentTitle, fileUrl, contestId, language } = req.body;

    const submission = new Submission({
      student: req.user.id,
      assignmentTitle,
      contestId,
      fileUrl,
      language, // ✅ include language here
    });

    await submission.save();
    res.status(201).json({ msg: "Submitted successfully", submission });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Dummy simulation function
function simulateExecution(code, input) {
  // You can enhance this later using Judge0
  return input.split("").reverse().join(""); // dummy "output"
}

exports.getMySubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find({ student: req.user.id });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getAllSubmissions = async (req, res) => {
  try {
    const all = await Submission.find().populate('student', 'name email');
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.evaluateSubmission = async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) return res.status(404).json({ msg: "Submission not found" });

    const assignment = await Assignment.findOne({ title: submission.assignmentTitle });
    if (!assignment) return res.status(404).json({ msg: "Assignment not found" });

    let total = 0;
    const verdicts = [];

    for (const test of assignment.testCases) {
      const passed = simulateExecution(submission.fileUrl, test.input, test.output);
      total += passed ? 1 : 0;
      verdicts.push({
        input: test.input,
        expectedOutput: test.output,
        actualOutput: passed ? test.output : "Wrong Output",
        passed,
      });
    }

    submission.verdicts = verdicts;
    submission.status = "reviewed";
    submission.marks = total * 2; // 2 marks per test case
    submission.remarks = total === assignment.testCases.length ? "✅ All test cases passed" : "❌ Some failed";
    await submission.save();

    res.json({ msg: "Submission evaluated", marks: submission.marks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Simulated evaluator
function simulateExecution(code, input, expectedOutput) {
  // ✅ Simulate logic — You can later replace this with Judge0 integration
  return Math.random() > 0.3; // Randomly pass or fail
}