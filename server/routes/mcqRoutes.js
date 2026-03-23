const express = require('express');
const router = express.Router();
const { getMCQs, getQuiz, submitQuizAnswers } = require('../controllers/mcqController');
const { protect } = require('../middleware/protect');
const { checkUsageLimit } = require('../utils/usageLimiter');

router.get('/', protect, getMCQs);
router.get('/quiz', protect, getQuiz);
router.post('/submit', protect, checkUsageLimit('mcq'), submitQuizAnswers);

module.exports = router;
