const mongoose = require('mongoose');

const AssignedQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  
  batch: { type: String, required: true }, // ✅ Added for batch filtering
  weekNumber: { type: Number, required: true },
  dueDate: { type: Date, required: true },

  exampleTestCase: {
    input: String,
    output: String
  },
  testCases: [
    {
      input: String,
      output: String,
      hidden: { type: Boolean, default: false }
    }
  ],

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminQuestion' }, // optional link to admin question
  assignedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssignedQuestion', AssignedQuestionSchema);
