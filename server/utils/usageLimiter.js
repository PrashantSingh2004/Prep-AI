const User = require('../models/User');

const FREE_LIMITS = {
  codingQuestionsPerDay: 5,
  mcqsPerDay: 20,
  mockInterviewsPerMonth: 3,
};

const checkUsageLimit = (type) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      // Pro users have no limits
      if (user.subscription && user.subscription.plan === 'pro') {
        return next();
      }

      // Check if we need to reset the daily/monthly limits
      if (!user.usageLimits) {
        user.usageLimits = {};
      }
      const now = new Date();
      const lastReset = user.usageLimits.lastResetDate || new Date(0);
      
      const isNewDay = now.getDate() !== lastReset.getDate() || 
                       now.getMonth() !== lastReset.getMonth() || 
                       now.getFullYear() !== lastReset.getFullYear();
                       
      const isNewMonth = now.getMonth() !== lastReset.getMonth() || 
                         now.getFullYear() !== lastReset.getFullYear();

      let needsSave = false;

      if (isNewDay) {
        user.usageLimits.codingQuestionsToday = 0;
        user.usageLimits.mcqsToday = 0;
        user.usageLimits.lastResetDate = now;
        needsSave = true;
      }
      
      if (isNewMonth) {
        user.usageLimits.mockInterviewsThisMonth = 0;
        needsSave = true;
      }

      // Verify the limit
      let limitReached = false;
      let limit = 0;
      let used = 0;
      let resetIn = isNewMonth && type === 'interview' ? 'next month' : 'tomorrow';

      if (type === 'coding') {
        limit = FREE_LIMITS.codingQuestionsPerDay;
        used = user.usageLimits.codingQuestionsToday;
        if (used >= limit) limitReached = true;
        else {
          user.usageLimits.codingQuestionsToday += 1;
          needsSave = true;
        }
      } else if (type === 'mcq') {
        limit = FREE_LIMITS.mcqsPerDay;
        used = user.usageLimits.mcqsToday;
        if (used >= limit) limitReached = true;
        else {
          user.usageLimits.mcqsToday += 1;
          needsSave = true;
        }
      } else if (type === 'interview') {
        limit = FREE_LIMITS.mockInterviewsPerMonth;
        used = user.usageLimits.mockInterviewsThisMonth;
        resetIn = 'next month';
        if (used >= limit) limitReached = true;
        else {
          user.usageLimits.mockInterviewsThisMonth += 1;
          needsSave = true;
        }
      }

      if (limitReached) {
        return res.status(429).json({
          error: "limit_reached",
          message: "You've reached your free plan limit.",
          limit,
          used,
          resetIn,
          upgradeTo: "pro"
        });
      }

      // Proceed and save increments if any limit was bumped
      if (needsSave) {
        await User.updateOne(
          { _id: user._id },
          { $set: { usageLimits: user.usageLimits } }
        );
      }

      // Also attach the incremented usage numbers so controllers can optionally see them
      req.user = user; 
      next();
    } catch (error) {
      console.error('Usage limiter error:', error);
      res.status(500).json({ message: 'Server error checking account limits' });
    }
  };
};

module.exports = {
  FREE_LIMITS,
  checkUsageLimit
};
