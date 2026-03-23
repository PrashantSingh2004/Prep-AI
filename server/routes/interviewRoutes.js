const express = require('express');
const router = express.Router();
const { startInterview, respondToInterview } = require('../controllers/interviewController');
const { protect } = require('../middleware/protect');
const { checkUsageLimit } = require('../utils/usageLimiter');

router.post('/start', protect, checkUsageLimit('interview'), startInterview);
router.post('/respond', protect, respondToInterview);

module.exports = router;
