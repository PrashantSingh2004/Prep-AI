const mongoose = require('mongoose');

const mcqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, 'Please add the question text'],
    },
    options: {
      type: [String],
      validate: [arrayLimit, 'Must have exactly 4 options'],
      required: true,
    },
    correctAnswer: {
      type: Number,
      required: true,
      min: 0,
      max: 3,
    },
    explanation: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      enum: ['DSA', 'OS', 'DBMS', 'Networking', 'System Design'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
  },
  {
    timestamps: true,
  }
);

function arrayLimit(val) {
  return val.length === 4;
}

module.exports = mongoose.model('MCQ', mcqSchema);
