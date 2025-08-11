const express = require('express');
const router = express.Router();

const AssignedQuestion = require('../models/AssignedQuestion');
const AdminQuestion = require('../models/AdminQuestion');

const { authMiddleware, requireRole } = require('../middleware/authMiddleware');

// ✅ GET all admin questions (for faculty to view and select)
router.get('/admin-questions', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const questions = await AdminQuestion.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: '❌ Error fetching questions', error: err.message });
  }
});

// ✅ POST assign a question to students with week & deadline
router.post('/assign-question', authMiddleware, requireRole('teacher'), async (req, res) => {
  try {
    const { questionId, weekNumber, deadline } = req.body;

    const assignment = new AssignedQuestion({
      questionId,
      weekNumber,
      deadline,
      assignedBy: req.user._id
    });

    await assignment.save();

    res.status(201).json({ message: '✅ Question assigned', data: assignment });
  } catch (err) {
    res.status(500).json({ message: '❌ Assignment failed', error: err.message });
  }
});

module.exports = router;
