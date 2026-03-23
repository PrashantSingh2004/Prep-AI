const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getSubscription,
  cancelSubscription,
  getUsage,
  getUserCount,
  submitFeedback
} = require('../controllers/userController');
const { protect } = require('../middleware/protect');

router.get('/count', getUserCount);
router.post('/feedback', submitFeedback);

router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/subscription', protect, getSubscription);
router.post('/cancel', protect, cancelSubscription);
router.get('/usage', protect, getUsage);

module.exports = router;
