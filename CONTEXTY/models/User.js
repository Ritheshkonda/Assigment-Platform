// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'faculty', 'student'], default: 'student' },

  // ✅ New field for student batch
  batch: {
    type: String,
    enum: ['Batch 1', 'Batch 2', 'Batch 3'],
    required: function () {
      return this.role === 'student';
    }
  }
}, { timestamps: true });

// Password hashing
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model('User', UserSchema);
