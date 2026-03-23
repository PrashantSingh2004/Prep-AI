const Question = require('../models/Question');

// @desc    Get all questions (with optional filters)
// @route   GET /api/questions
// @access  Private
const getQuestions = async (req, res) => {
  try {
    const { difficulty, tag, search } = req.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    let query = {};

    if (difficulty) {
      query.difficulty = difficulty;
    }

    if (tag) {
      query.tags = { $in: [tag] };
    }

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const total = await Question.countDocuments(query);
    const questions = await Question.find(query)
      .select('-solution')
      .skip(startIndex)
      .limit(limit);

    res.status(200).json({
      success: true,
      count: questions.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: questions
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single question
// @route   GET /api/questions/:id
// @access  Private
const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create question
// @route   POST /api/questions
// @access  Private/Admin
const createQuestion = async (req, res) => {
  try {
    // In a real app we'd verify admin status here
    // For now we assume the protect middleware user is valid 
    // or add an admin check separately
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error or duplicate title' });
  }
};

module.exports = {
  getQuestions,
  getQuestion,
  createQuestion,
};
