const UserLogs = require("../models/UserLogs");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const { isValidEmail, isValidPhoneNumber } = require("../utils/Check");
const { SendMail } = require("../utils/SendMail");
const StorageFacility = require("../models/StorageFacility");
const { sendOtp, validateOtp } = require("../utils/SendSms");
const StorageCapacity = require("../models/StorageCapacity");
const Roles = require("../models/Roles");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const createUserLog = async (emailOrPhone, otp) => {
  const otpExpires = moment().add(10, "minutes").toDate();
  // Create a new UserLogs entry
  const newUserLog = new UserLogs({
    Email: emailOrPhone,
    EmailOtp: otp,
    OtpExpires: otpExpires,
    CreatedOn: Date.now(),
  });

  // Save the new log entry
  await newUserLog.save();
};
const createUserLogm = async (emailOrPhone) => {
  const phoneotp = await sendOtp(emailOrPhone);
  const PhoneOtp = phoneotp.data.verificationId;
  const OtpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

  // Create a new UserLogs entry
  const newUserLog = new UserLogs({
    PhoneNumber: emailOrPhone,
    PhoneOtp: PhoneOtp,
    OtpExpires: OtpExpires,
    CreatedOn: Date.now(),
  });

  // Save the new log entry
  await newUserLog.save();
};

exports.sendOtp = async (req, res) => {
  const { Email } = req.body;

  if (!Email) {
    return res.status(400).json({
      success: false,
      message:
        "The Email field is mandatory. Please provide a valid email address to proceed.",
    });
  }

  const otp = generateOtp();

  try {
    // Validate email or phone number format
    const isEmailValid = isValidEmail(Email);
    const isPhoneValid = isValidPhoneNumber(Email);

    if (!isEmailValid && !isPhoneValid) {
      return res.status(400).json({
        success: false,
        message:
          "The provided credential information is invalid. Please enter a valid email address or phone number.",
      });
    }

    // Check if the user is registered
    const user = await User.findOne({
      $or: [{ Email: Email }, { PhoneNumber: Email }],
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "No user is registered with the provided information. Please verify and try again.",
      });
    }

    // Send OTP based on the type of contact (email or phone)
    if (isEmailValid) {
      await SendMail(
        Email,
        "Book My Cold Store : Your OTP for secure login",
        otp
      );
      await createUserLog(Email, otp);
    } else {
      await createUserLogm(Email);
    }
    res.status(200).json({
      success: true,
      message:
        "An OTP has been sent to your registered email address or phone number successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "We encountered an issue while sending the OTP. Please try again later.",
    });
  }
};

exports.verifyOtp = async (req, res) => {
  const { Email, Otp } = req.body;

  if (!Email || !Otp) {
    return res
      .status(400)
      .json({
        success: false,
        message: "The Email and OTP fields are required.",
      });
  }

  const isEmailValid = isValidEmail(Email);
  const isPhoneValid = isValidPhoneNumber(Email);

  try {
    // Find the most recent UserLog document by Email or PhoneNumber
    const userLog = await UserLogs.findOne({
      $or: [{ Email: Email }, { PhoneNumber: Email }],
    }).sort({ CreatedOn: -1 });

    if (!userLog) {
      return res.status(400).json({
        success: false,
        message:
          "No OTP record was found for the provided email or phone number. Please request a new OTP.",
      });
    }

    if (isEmailValid) {
      // Check if the OTP has expired for email
      if (moment(userLog.OtpExpires).isBefore(moment())) {
        return res.status(400).json({
          success: false,
          message:
            "The OTP for the provided email address has expired. Please request a new OTP to continue.",
        });
      }

      // Check if the OTP is valid for email
      if (userLog.EmailOtp !== Otp) {
        return res.status(400).json({
          success: false,
          message:
            "The OTP entered for the email address is invalid. Please verify and try again.",
        });
      }
    } else {
      // Validate the OTP using the stored verificationId and provided PhoneOtp for phone number
      const isValidOtp = await validateOtp(userLog.PhoneOtp, Otp);
      if (!isValidOtp || isValidOtp.responseCode !== 200) {
        return res.status(400).json({
          success: false,
          message:
            "The OTP for the phone number is invalid or has expired. Please request a new OTP to proceed.",
        });
      }
    }

    // OTP is correct, now create or find the user and generate token
    let user = await User.findOne({
      $or: [{ Email: Email }, { PhoneNumber: Email }],
    });

    if (!user) {
      // Create a new user if it doesn't exist
      user = new User({
        Email: isEmailValid ? Email : null,
        PhoneNumber: isPhoneValid ? Email : null,
      });
      await user.save();
    }

    // Generate JWT token using the user's ID
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    // Check for existing storage facilities for the user
    const facilityExists = await StorageFacility.findOne({ User: user._id });

    let redirectUri = facilityExists ? "/managefacilities" : "/dashboard";
    let type = facilityExists ? "owner" : "user";

    if (user.RoleId) {
      const isAdmin = await Roles.findById(user.RoleId);
      console.log(isAdmin);
      if (isAdmin.RoleName === "Global Admin") {
        redirectUri = "/admin/dashboard";
        type = "admin";
      } else if (isAdmin.RoleName === "User") {
        type = "user";
      } else if (isAdmin.RoleName === "Owner") {
        type = "owner";
      }
    }
    // Optionally, clear OTP after successful verification
    if (isEmailValid) {
      userLog.EmailOtp = null;
    } else if (isPhoneValid) {
      userLog.PhoneOtp = null;
    }
    userLog.OtpExpires = null;
    await userLog.save();

    res.status(200).json({
      success: true,
      message:
        "The OTP has been verified successfully. You can now access your account.",
      token,
      type,
      redirectUri,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "An unexpected error occurred while verifying the OTP. Please try again later.",
      error: error.message,
    });
  }
};
