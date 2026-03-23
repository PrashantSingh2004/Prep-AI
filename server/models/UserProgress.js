const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Question',
    },
    status: {
      type: String,
      enum: ['unsolved', 'attempted', 'solved'],
      default: 'unsolved',
    },
    submittedCode: {
      javascript: { type: String, default: '' },
      python: { type: String, default: '' },
      java: { type: String, default: '' },
    },
    solvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// User can only have one progress record per question
userProgressSchema.index({ user: 1, question: 1 }, { unique: true });
// Index for querying all progress for a single user quickly
userProgressSchema.index({ user: 1 });

module.exports = mongoose.model('UserProgress', userProgressSchema);
