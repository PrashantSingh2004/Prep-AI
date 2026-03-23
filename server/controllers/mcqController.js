const MCQ = require('../models/MCQ');
const MCQResult = require('../models/MCQResult');

// @desc    Get all MCQs or filter by topic/difficulty
// @route   GET /api/mcq
// @access  Private
const getMCQs = async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    let query = {};
    if (topic) query.topic = topic;
    if (difficulty) query.difficulty = difficulty;

    const mcqs = await MCQ.find(query).select('-correctAnswer -explanation');
    res.status(200).json(mcqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get random quiz set
// @route   GET /api/mcq/quiz
// @access  Private
const getQuiz = async (req, res) => {
  try {
    const topic = req.query.topic;
    const limit = parseInt(req.query.limit) || 10;
    
    let query = {};
    if (topic) query.topic = topic;

    // Use aggregate to get random documents
    const mcqs = await MCQ.aggregate([
      { $match: query },
      { $sample: { size: limit } },
      // Hide correct answer from client initially
      { $project: { correctAnswer: 0, explanation: 0 } } 
    ]);

    res.status(200).json(mcqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Submit MCQ quiz answers
// @route   POST /api/mcq/submit
// @access  Private
const submitQuizAnswers = async (req, res) => {
  try {
    const { topic, answers } = req.body; 
    // answers should be array of { questionId, selectedAnswer }
    
    if (!answers || answers.length === 0) {
      return res.status(400).json({ message: 'No answers provided' });
    }

    let score = 0;
    const processedAnswers = [];
    const questionIds = answers.map(a => a.questionId);
    
    // Fetch all submitted questions at once
    const questions = await MCQ.find({ _id: { $in: questionIds } });
    
    // Map them for easy lookup
    const qMap = {};
    questions.forEach(q => {
      qMap[q._id.toString()] = q;
    });

    for (let ans of answers) {
      const q = qMap[ans.questionId];
      if (!q) continue;

      const isCorrect = (q.correctAnswer === ans.selectedAnswer);
      if (isCorrect) score += 1;

      processedAnswers.push({
        questionId: q._id,
        question: q.question,
        userOption: (ans.selectedAnswer != null && ans.selectedAnswer >= 0) ? q.options[ans.selectedAnswer] : null,
        correctOption: q.options[q.correctAnswer],
        selectedAnswer: ans.selectedAnswer,
        isCorrect: isCorrect,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation // Include explanation for review
      });
    }

    // Save result mapping to the db
    const result = await MCQResult.create({
      user: req.user._id,
      topic: topic || 'Mixed',
      score,
      totalQuestions: answers.length,
      answers: processedAnswers.map(pa => ({
        questionId: pa.questionId,
        selectedAnswer: pa.selectedAnswer,
        isCorrect: pa.isCorrect
      }))
    });

    res.status(200).json({
      topic: topic || 'Mixed',
      score,
      totalQuestions: answers.length,
      resultId: result._id,
      answers: processedAnswers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMCQs,
  getQuiz,
  submitQuizAnswers
};
