const User = require('../models/User');
const Feedback = require('../models/Feedback');

// @desc    Get user profile & subscription
// @route   GET /api/user/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('getUserProfile error:', error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @desc    Update user profile
// @route   PUT /api/user/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update name if provided
    if (req.body.name) user.name = req.body.name;

    // Update profile fields
    const { bio, college, targetRole, linkedIn, github } = req.body;
    if (user.profile) {
      if (bio !== undefined) user.profile.bio = bio;
      if (college !== undefined) user.profile.college = college;
      if (targetRole !== undefined) user.profile.targetRole = targetRole;
      if (linkedIn !== undefined) user.profile.linkedIn = linkedIn;
      if (github !== undefined) user.profile.github = github;
    } else {
      user.profile = { bio, college, targetRole, linkedIn, github };
    }

    const updatedUser = await user.save();
    
    // Return standard payload format without password
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      subscription: updatedUser.subscription,
      usageLimits: updatedUser.usageLimits,
      profile: updatedUser.profile
    });
  } catch (error) {
    console.error('updateUserProfile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

// @desc    Get subscription specific details
// @route   GET /api/user/subscription
// @access  Private
const getSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const sub = user.subscription || { plan: 'free', status: 'active' };
    
    let daysLeft = null;
    if (sub.expiresAt) {
      const diffTime = new Date(sub.expiresAt) - new Date();
      daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    res.json({
      plan: sub.plan,
      status: sub.status,
      startedAt: sub.startedAt,
      expiresAt: sub.expiresAt,
      daysLeft: daysLeft > 0 ? daysLeft : null,
    });
  } catch (error) {
    console.error('getSubscription error:', error);
    res.status(500).json({ message: 'Server error fetching subscription' });
  }
};

// @desc    Cancel subscription
// @route   POST /api/user/cancel
// @access  Private
const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Set status to cancelled (they still have access until expiresAt)
    if (user.subscription) {
      user.subscription.status = 'cancelled';
      await user.save();
    }

    res.json({ message: 'Subscription successfully scheduled for cancellation.' });
  } catch (error) {
    console.error('cancelSubscription error:', error);
    res.status(500).json({ message: 'Server error cancelling subscription' });
  }
};

// @desc    Get usage statistics compared to limits
// @route   GET /api/user/usage
// @access  Private
const getUsage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { FREE_LIMITS } = require('../utils/usageLimiter');

    res.json({
      codingQuestionsToday: user.usageLimits?.codingQuestionsToday || 0,
      codingQuestionsLimit: FREE_LIMITS.codingQuestionsPerDay,
      mcqsToday: user.usageLimits?.mcqsToday || 0,
      mcqsLimit: FREE_LIMITS.mcqsPerDay,
      mockInterviewsThisMonth: user.usageLimits?.mockInterviewsThisMonth || 0,
      mockInterviewsLimit: FREE_LIMITS.mockInterviewsPerMonth,
      plan: user.subscription?.plan || 'free',
      lastResetDate: user.usageLimits?.lastResetDate
    });
  } catch (error) {
    console.error('getUsage error:', error);
    res.status(500).json({ message: 'Server error fetching usage limits' });
  }
};

// @desc    Get total count of registered users for the landing page
// @route   GET /api/user/count
// @access  Public
const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('getUserCount error:', error);
    res.status(500).json({ message: 'Server error fetching user count' });
  }
};

// @desc    Submit user feedback from the landing page
// @route   POST /api/user/feedback
// @access  Public
const submitFeedback = async (req, res) => {
  try {
    const { name, email, message, rating } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Please provide name, email, and message' });
    }

    const feedback = await Feedback.create({
      name,
      email,
      message,
      rating: rating || 5
    });

    res.status(201).json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('submitFeedback error:', error);
    res.status(500).json({ message: 'Server error submitting feedback' });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getSubscription,
  cancelSubscription,
  getUsage,
  getUserCount,
  submitFeedback
};
