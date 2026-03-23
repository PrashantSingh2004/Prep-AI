const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: '',
    },
    subscription: {
      plan: { type: String, enum: ['free', 'pro'], default: 'free' },
      status: { type: String, enum: ['active', 'expired', 'cancelled'], default: 'active' },
      startedAt: { type: Date },
      expiresAt: { type: Date },
      razorpaySubscriptionId: { type: String },
      razorpayCustomerId: { type: String },
    },
    usageLimits: {
      codingQuestionsToday: { type: Number, default: 0 },
      mcqsToday: { type: Number, default: 0 },
      mockInterviewsThisMonth: { type: Number, default: 0 },
      lastResetDate: { type: Date, default: Date.now },
    },
    profile: {
      bio: { type: String, default: '' },
      college: { type: String, default: '' },
      targetRole: { type: String, default: '' },
      linkedIn: { type: String, default: '' },
      github: { type: String, default: '' },
    }
  },
  {
    timestamps: true,
  }
);

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
