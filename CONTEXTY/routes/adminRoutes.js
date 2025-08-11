// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const AdminQuestion = require('../models/AdminQuestion');
const { authMiddleware, requireRole } = require("../middleware/authMiddleware"); // Make sure this path is correct

// ✅ Add a new week-wise question (Admin)
router.post('/questions/add', authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const newQ = new AdminQuestion(req.body);
    await newQ.save();
    res.status(201).json({ message: 'Question added successfully', question: newQ });
  } catch (err) {
    res.status(500).json({ message: 'Error adding question', error: err.message });
  }
});

// ✅ Get all admin questions (for faculty & admin)
router.get('/questions/all', authMiddleware, requireRole("admin", "teacher"), async (req, res) => {
  try {
    const questions = await AdminQuestion.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching questions', error: err.message });
  }
});

module.exports = router;
