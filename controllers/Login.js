const crypto = require("crypto");
const User = require("../models/User"); // Adjust to your User model
const { SendMail,sendSMS } = require("../utils/SendMail");

// Helper function to check if input is a valid email address
const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// Helper function to check if input is a valid phone number
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^[0-9]{10}$/; // Adjust the regex based on your phone number format (e.g., 10 digits)
  return phoneRegex.test(phone);
};

// Generate a random OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
};

// Login/Signup Controller 
exports.loginOrSignup = async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({ message: "Email or PhoneNumber is required" });
  }

  try {
    // Check if the input is a valid email or phone number
    let isEmail = isValidEmail(Email);
    let isPhoneNumber = isValidPhoneNumber(Email);

    if (!isEmail && !isPhoneNumber) {
      return res.status(400).json({ message: "Invalid email or phone number format" });
    }

    // Check if the user exists in the database (based on email or phone number)
    let user = await User.findOne({ Email });
    // Generate OTP
    const Otp = generateOTP();

    // Save OTP to the database (only one OTP for both cases)
    if (user) {
      // Update OTP fields based on the input type
      if (isEmail) {
        user.EmailOtp = Otp;
        user.OtpExpires = Date.now() + 60 * 60 * 1000; // OTP valid for 60 minutes
        await user.save();

        // Send OTP via email
        await SendMail(Email, "Your Login OTP", `Your OTP is: ${Otp}`);
      } else if (isPhoneNumber) {
        user.PhoneOtp = Otp;
        user.OtpExpires = Date.now() + 60 * 60 * 1000; // OTP valid for 60 minutes
        await user.save();

        // Send OTP via SMS (Assuming SMS service is integrated)
        await sendSMS(Email, `Your OTP is: ${Otp}`); // Treat phone number as Email (same field for both)
      }

      return res.status(200).json({
        message: "OTP sent successfully",
        redirectUri: "/search", // Redirect to the search page
      });
    } else {
      // Create a new user entry with OTP
      user = new User({
        Email,
        OtpExpires: Date.now() + 10 * 60 * 1000, // OTP valid for 10 minutes
      });

      // Set OTP fields based on the input type
      if (isEmail) {
        user.EmailOtp = Otp;
        await user.save();
        // Send OTP via email
        await SendMail(Email, "Your Signup OTP", `Your OTP is: ${Otp}`);
      } else if (isPhoneNumber) {
        user.PhoneOtp = Otp;
        await user.save();
        // Send OTP via SMS
        await sendSMS(Email, `Your OTP is: ${Otp}`);
      }

      return res.status(200).json({
        message: "OTP sent successfully",
        redirectUri: "/completeprofile", // Redirect to the profile completion page
      });
    }
  } catch (error) {
    console.error("Error in loginOrSignup:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Verify OTP Controller
exports.verifyOTP = async (req, res) => {
  const { Email, Otp } = req.body;

  if (!Email || !Otp) {
    return res.status(400).json({ message: "Email or PhoneNumber and OTP are required" });
  }

  try {
    // Check if the user exists in the database based on Email or PhoneNumber
    let user = await User.findOne({ Email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Determine which OTP to verify (email or phone)
    let isEmail = isValidEmail(Email);
    let isPhoneNumber = isValidPhoneNumber(Email);

    if (isEmail) {
      // Verify Email OTP
      if (user.EmailOtp !== Otp || user.OtpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      // OTP is valid, clear EmailOtp and OtpExpires
      user.EmailOtp = undefined;
    } else if (isPhoneNumber) {
      // Verify Phone OTP
      if (user.PhoneOtp !== Otp || user.OtpExpires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
      // OTP is valid, clear PhoneOtp and OtpExpires
      user.PhoneOtp = undefined;
    }

    // Clear OtpExpires field
    user.OtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    console.error("Error in verifyOTP:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


