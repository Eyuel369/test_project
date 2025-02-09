const express = require('express');
const { registerUser, verifyOTP, registerUserInfo, registerPin, agreeToTerms } = require('../controllers/userController');

const router = express.Router();

// Register user
router.post('/registerUser', registerUser);

// Verify OTP
router.post('/verifyOTP', verifyOTP);

// Register user info (first name and last name)
router.post('/registerUserInfo', registerUserInfo);

// Register user pin 
router.post('/registerPin', registerPin);

// Register user pin 
router.post('/agreeToTerms', agreeToTerms);

module.exports = router;