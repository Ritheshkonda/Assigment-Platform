const mongoose = require('mongoose');

const adminQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  inputFormat: { type: String },
  outputFormat: { type: String },
  sampleTestCases: [String],
  weekNumber: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminQuestion', adminQuestionSchema);
