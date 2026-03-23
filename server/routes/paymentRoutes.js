const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, webhook } = require('../controllers/paymentController');
const { protect } = require('../middleware/protect');

// Authenticated protected routes
router.post('/create-order', protect, createOrder);
router.post('/verify', protect, verifyPayment);

// Public route (Secured internally using crypto signature validation)
router.post('/webhook', express.json({type: 'application/json'}), webhook);

module.exports = router;
