const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');

// Initialize Razorpay instance safely (avoid crashing if keys missing during dev)
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Create a new Razorpay Order for Pro Subscription
// @route   POST /api/payment/create-order
// @access  Private
const createOrder = async (req, res) => {
  try {
    const isMockSetup = !razorpay || process.env.RAZORPAY_KEY_ID === 'your_key_id';

    const { plan, billingCycle } = req.body;
    
    // We only support 'pro' currently, but validate anyway
    if (plan !== 'pro') {
      return res.status(400).json({ message: 'Invalid plan selected' });
    }

    // Determine amount based on billing cycle (monthly vs yearly)
    let amountPaise;
    if (billingCycle === 'yearly') {
      amountPaise = 329900; // ₹3,299 per year
    } else {
      amountPaise = 29900; // ₹299 per month
    }

    if (isMockSetup) {
      return res.status(200).json({
        orderId: `mock_order_${Date.now()}`,
        amount: amountPaise,
        currency: 'INR',
        keyId: 'mock_key_id',
        isMock: true
      });
    }

    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: 'INR',
      receipt: `receipt_${req.user.id}_${Date.now()}`
    });

    res.status(200).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Server error creating order' });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
const verifyPayment = async (req, res) => {
  console.log('[Payment Verify] Received request', JSON.stringify(req.body));
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, billingCycle } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: 'Missing payment details' });
    }

    // Bypass signature lock if admin mock flow is engaged
    // Mock orders are allowed when: order has mock prefix AND (no real razorpay instance OR placeholder keys)
    const isMockSetup = !razorpay || !process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID === 'your_key_id';
    const isMockTxn = razorpay_order_id.startsWith('mock_order_') && isMockSetup;
    console.log('[Payment Verify] isMockSetup:', isMockSetup, 'isMockTxn:', isMockTxn);

    if (!isMockTxn) {
      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSig = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

      if (expectedSig !== razorpay_signature) {
        return res.status(400).json({ message: 'Invalid payment signature' });
      }
    } else {
      console.log(`[Admin Notice] User ${req.user.id} initiated a Mock Payment Checkout. Upgrading their account...`);
    }

    // Calculate expiration date
    const expiresAt = new Date();
    if (billingCycle === 'yearly') {
      expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    } else {
      expiresAt.setMonth(expiresAt.getMonth() + 1);
    }

    // Use findByIdAndUpdate with $set to safely update fields regardless of subdoc initialization state
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: {
          'subscription.plan': 'pro',
          'subscription.status': 'active',
          'subscription.startedAt': new Date(),
          'subscription.expiresAt': expiresAt,
          'subscription.razorpaySubscriptionId': razorpay_payment_id,
          'usageLimits.codingQuestionsToday': 0,
          'usageLimits.mcqsToday': 0,
          'usageLimits.mockInterviewsThisMonth': 0,
          'usageLimits.lastResetDate': new Date(),
        }
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found during update' });
    }
    
    console.log('[Payment Verify] User upgraded successfully:', req.user.id);

    res.status(200).json({
      success: true,
      plan: 'pro',
      status: 'active',
      expiresAt: updatedUser.subscription.expiresAt,
    });
  } catch (error) {
    console.error('Error verifying payment:', error.message, error.stack);
    res.status(500).json({ message: 'Server error verifying payment' });
  }
};

// @desc    Handle Razorpay Webhooks asynchronously
// @route   POST /api/payment/webhook
// @access  Public (Signature validated)
const webhook = async (req, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'];
    
    if (!signature || !process.env.RAZORPAY_KEY_SECRET) return res.status(400).send();

    // Verify webhook authenticity
    const body = JSON.stringify(req.body);
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== signature) {
      return res.status(400).json({ message: 'Invalid webhook signature' });
    }

    const event = req.body.event;
    // We would parse req.body.payload here to find the mapped user
    // Since this is just a stub for full production tracking:
    if (event === 'payment.failed') {
       console.log('Payment failed via Webhook!');
    } else if (event === 'subscription.cancelled') {
       console.log('Subscription cancelled via Webhook!');
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).send();
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  webhook
};
