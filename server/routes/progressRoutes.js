const express = require('express');
const router = express.Router();
const { submitAttempt, getUserProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/protect');
const { checkUsageLimit } = require('../utils/usageLimiter');

router.post('/submit', protect, checkUsageLimit('coding'), submitAttempt);
router.get('/', protect, getUserProgress);

module.exports = router;
