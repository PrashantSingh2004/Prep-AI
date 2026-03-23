const express = require('express');
const router = express.Router();
const { getMyAnalytics } = require('../controllers/analyticsController');
const { protect } = require('../middleware/protect');

router.get('/me', protect, getMyAnalytics);

module.exports = router;
