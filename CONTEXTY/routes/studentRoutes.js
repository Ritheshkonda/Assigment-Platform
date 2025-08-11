const express = require('express');
const router = express.Router();
const AssignedQuestion = require('../models/AssignedQuestion');
const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// ✅ Get week-wise assigned questions for the logged-in student
router.get('/assigned-questions', authMiddleware, requireRole('student'), async (req, res) => {
  try {
    // Student's batch comes from token
    const studentBatch = req.user.batch;
    if (!studentBatch) {
      return res.status(400).json({ message: '❌ Student batch not set' });
    }

    // Fetch only assignments for this student's batch
    const assignments = await AssignedQuestion.find({ batch: studentBatch }).populate('questionId');

    // Group by week
    const grouped = {};
    assignments.forEach((item) => {
      const week = item.weekNumber;
      if (!grouped[week]) grouped[week] = [];
      grouped[week].push({
        _id: item._id,
        deadline: item.dueDate,
        assignedAt: item.assignedAt,
        question: item.questionId || {
          title: item.title,
          description: item.description,
          difficulty: item.difficulty,
          testCases: item.testCases
        },
        weekNumber: item.weekNumber
      });
    });

    res.status(200).json({ message: '✅ Week-wise assignments', data: grouped });
  } catch (err) {
    console.error('❌ Error fetching student assignments:', err);
    res.status(500).json({ message: '❌ Could not fetch assignments', error: err.message });
  }
});

module.exports = router;
