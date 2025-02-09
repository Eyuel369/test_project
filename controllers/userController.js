const User = require('../models/User');
const axios = require('axios');

const sendOTP = async (phone, otp) => {
    let phonenumber = String(phone);
  
    let otpval = String(otp);
  
    const baseUrl = "https://api.afromessage.com/api/send";
    // api token
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiMFBQenBCaU14Y29LcWlGbmpIR1BoSEhRc2NuZGtOYlMiLCJleHAiOjE4NjgyMTQxMzMsImlhdCI6MTcxMDQ0NzczMywianRpIjoiNmJmNDA1ODctYTM1ZS00OWJhLWFkMzctY2RmNzBkNjkzZmVlIn0.dswtSeuZidX9skZuqjkd6Dz5p0UfClQcWCdUdURtLoY";
    // header
    const headers = { Authorization: "Bearer " + token };
    // request parameters
    const to = phonenumber;
    const message = `Your Registration app OTP is ${otpval} use this OTP to verify your account.`;
    const from = "e80ad9d8-adf3-463f-80f4-7c4b39f7f164";
    // final url
    const url = `${baseUrl}?from=${from}&to=${to}&message=${message}`;
  
    // make request
    axios
      .get(url, { headers })
      .then((response) => {
        // check result
        if (response.status === 200) {
          // request is success. inspect the json object for the value of `acknowledge`
          const json = response.data;
          if (json.acknowledge === "success") {
            // do success
            console.log("OTP api success");
          } else {
            // do failure
            console.log("OTP api error");
          }
        } else {
          // anything other than 200 goes here.
          console.log(
            `http error ... code: ${response.status}, msg: ${response.data}`
          );
        }
      })
      .catch((error) => {
        console.log(error);
      });
};

const registerUser = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    console.log(req.body);
    // Check if the phone number already exists

    if (!phoneNumber ) { 
        return res.status(400).json({ message: 'Missing required fields' });
      }

    const existingUser = await User.findOne({ phoneNumber });
    if (existingUser) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    // Create a new user
    const newUser = new User({
      phoneNumber,
      otp,
    });

    await newUser.save();
    // await sendOTP(phoneNumber, otp);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        phoneNumber: newUser.phoneNumber,
        otp: newUser.otp,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const verifyOTP = async (req, res) => {
    try {
      const { phoneNumber, otp } = req.body;
  
      // Find the user by phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Check if the provided OTP matches the stored OTP
      if (user.otp !== otp) {
        return res.status(400).json({ message: 'Invalid OTP' });
      }
  
      // Update the user: clear the OTP and set otpVerified to true
      user.otp = null; // Clear the OTP
      user.otpVerified = true; // Mark OTP as verified
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({
        message: 'OTP verified successfully',
        user: {
          phoneNumber: user.phoneNumber,
          otpVerified: user.otpVerified,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const registerUserInfo = async (req, res) => {
    try {
      const { phoneNumber, firstName, lastName } = req.body;
  
      // Validate input
      if (!phoneNumber || !firstName || !lastName) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Find the user by phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Check if OTP is verified
      if (!user.otpVerified) {
        return res.status(400).json({ message: 'OTP not verified' });
      }
  
      // Update the user's first name and last name
      user.firstName = firstName;
      user.lastName = lastName;
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({
        message: 'User information registered successfully',
        user: {
          phoneNumber: user.phoneNumber,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  const registerPin = async (req, res) => {
    try {
      const { phoneNumber, pin } = req.body;
  
      // Validate input
      if (!phoneNumber || !pin) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Find the user by phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Check if OTP is verified
      if (!user.otpVerified) {
        return res.status(400).json({ message: 'OTP not verified' });
      }
  
      // Update the user's first name and last name
      user.pin = pin;
      
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({
        message: 'User pin registered successfully',
        user: {
          phoneNumber: user.phoneNumber,
          pin: user.pin,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  const agreeToTerms = async (req, res) => {
    try {
      const { phoneNumber } = req.body;
  
      // Validate input
      if (!phoneNumber ) {
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Find the user by phone number
      const user = await User.findOne({ phoneNumber });
      if (!user) {
        return res.status(400).json({ message: 'User not found' });
      }
  
      // Check if OTP is verified
      if (!user.otpVerified) {
        return res.status(400).json({ message: 'OTP not verified' });
      }
  
      // Update the user's first name and last name
      user.agreedToTerms = true;
      
  
      // Save the updated user
      await user.save();
  
      res.status(200).json({
        message: 'User agreed to terms successfully',
        user: {
          phoneNumber: user.phoneNumber,
          agreement: user.agreedToTerms,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  module.exports = { registerUser, verifyOTP, registerUserInfo, registerPin, agreeToTerms };