const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  phoneNumber: {
    type: String,
    required: true,
    minlength: 13,
    maxlength: 13,
    unique: true,
  },
  pin: {
    type: String,
   
  },
  otp: {
    type: String,
    minlength: 4,
    maxlength: 4,
  },
  otpVerified: { type: Boolean, default: false },
  agreedToTerms: { type: Boolean, default: false },
}, { timestamps: true });

// Middleware to hash the PIN before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
  next();
});

module.exports = mongoose.model('User', userSchema);