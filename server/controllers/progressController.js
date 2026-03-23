const UserProgress = require('../models/UserProgress');
const Question = require('../models/Question');

// @desc    Submit user attempt for a question
// @route   POST /api/progress/submit
// @access  Private
const submitAttempt = async (req, res) => {
  try {
    const { questionId, status, submittedCode, language } = req.body;
    const userId = req.user._id;

    if (!questionId || !status || !submittedCode || !language) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let progress = await UserProgress.findOne({ user: userId, question: questionId });

    if (progress) {
      // Update existing progress
      progress.status = status;
      progress.submittedCode = {
        ...progress.submittedCode,
        [language]: submittedCode,
      };
      
      if (status === 'solved') {
        progress.solvedAt = new Date();
      }

      await progress.save();
    } else {
      // Create new progress record
      progress = await UserProgress.create({
        user: userId,
        question: questionId,
        status,
        submittedCode: { [language]: submittedCode },
        ...(status === 'solved' ? { solvedAt: new Date() } : {})
      });
    }

    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get user progress for all questions
// @route   GET /api/progress
// @access  Private
const getUserProgress = async (req, res) => {
  try {
    const progress = await UserProgress.find({ user: req.user._id });
    res.status(200).json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  submitAttempt,
  getUserProgress
};
