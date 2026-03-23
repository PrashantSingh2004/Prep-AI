const express = require('express');
const router = express.Router();
const { getQuestions, getQuestion, createQuestion } = require('../controllers/questionController');
const { protect } = require('../middleware/protect');

router.route('/')
  .get(protect, getQuestions)
  .post(protect, createQuestion); // Assuming admin check is elsewhere or omitted for simple demo

router.route('/:id')
  .get(protect, getQuestion);

module.exports = router;
