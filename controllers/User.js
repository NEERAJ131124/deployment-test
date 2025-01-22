const User = require("../models/User");
const GeoLocation = require("../models/GeoLocation");
const { SendMail } = require("../utils/SendMail");
const UserLogs = require("../models/UserLogs");
const { sendOtp, validateOtp } = require("../utils/SendSms");
const jwt = require("jsonwebtoken");
const { uploadAzureFileInController } = require("../utils/FileUploading");

const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const verifyEmailOtpFunction = async (Email, EmailOtp) => {
  if (!Email || !EmailOtp) {
    throw new Error("Please provide both Email and Email OTP to proceed.");
  }

  const olduser = await User.findOne({ Email, EmailVerified: true });
  if (olduser) {
    return { success: true, message: "Email already verified" };
  }

  const userLog = await UserLogs.findOne({ Email }).sort({ CreatedOn: -1 });
  if (!userLog) {
    return {
      success: false,
      message:
        "User log not found. Please verify the information provided and try again.",
    };
  }

  if (userLog.EmailOtp !== EmailOtp || new Date() > userLog.OtpExpires) {
    return {
      success: false,
      message:
        "The Email OTP is invalid or has expired. Please request a new OTP and try again.",
    };
  }

  let user = await User.findOne({
    $or: [{ Email: userLog.Email }, { PhoneNumber: userLog.PhoneNumber }],
  });

  if (!user) {
    user = new User({
      Email: userLog.Email,
      PhoneNumber: userLog.PhoneNumber || null,
      EmailVerified: true,
      PhoneVerified: false,
      IsVerified: false,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
    });
    await user.save();
  } else {
    const updates = { EmailVerified: true, UpdatedOn: new Date() };

    if (user.PhoneVerified) {
      updates.IsVerified = true;
    }

    await user.updateOne(updates);
  }

  return { success: true, message: "Email has been verified successfully." };
};

const verifyPhoneOtpFunction = async (PhoneNumber, PhoneOtp) => {
  if (!PhoneNumber || !PhoneOtp) {
    throw new Error("Phone number and OTP are required to proceed.");
  }
  const oldUser = await User.findOne({ PhoneNumber, PhoneVerified: true });
  if (oldUser) {
    return {
      success: true,
      message: "The phone number has already been verified.",
    };
  }
  const userLog = await UserLogs.findOne({ PhoneNumber }).sort({
    CreatedOn: -1,
  });
  if (!userLog) {
    throw new Error(
      "User log not found. Please verify the information provided and try again."
    );
  }

  const isValidOtp = await validateOtp(userLog.PhoneOtp, PhoneOtp);
  if (!isValidOtp || isValidOtp.responseCode !== 200) {
    throw new Error(
      "The Phone OTP is invalid or has expired. Please request a new OTP and try again."
    );
  }

  let user = await User.findOne({
    $or: [{ Email: userLog.Email }, { PhoneNumber: userLog.PhoneNumber }],
  });

  if (user && user.IsVerified) {
    throw new Error(
      "The user is already registered. Please use a different email or phone number to register."
    );
  }

  if (!user) {
    user = new User({
      Email: userLog.Email || null,
      PhoneNumber: userLog.PhoneNumber,
      EmailVerified: false,
      PhoneVerified: true,
      IsVerified: false,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
    });
    await user.save();
  } else {
    const updates = { PhoneVerified: true, UpdatedOn: new Date() };

    if (user.EmailVerified) {
      updates.IsVerified = true;
    }

    await user.updateOne(updates);
  }

  return {
    success: true,
    message: "Phone number has been verified successfully.",
  };
};

exports.registerUser = async (req, res) => {
  try {
    const { Email, Mobile } = req.body;

    if (!Email || !Mobile) {
      return res.status(400).json({
        success: false,
        message:
          "Email and phone number are mandatory fields. Please provide the required information to proceed.",
      });
    }

    const existingUserByEmail = await User.findOne({ Email });
    const existingUserByPhone = await User.findOne({ PhoneNumber: Mobile });
    // validations
    if (
      existingUserByEmail &&
      existingUserByPhone &&
      existingUserByEmail.IsVerified &&
      existingUserByPhone.IsVerified
    ) {
      return res.status(400).json({
        success: false,
        message:
          "The provided email address and mobile number are already associated with a verified account. Please use different credentials to proceed.",
      });
    }

    if (existingUserByEmail && existingUserByEmail.IsVerified) {
      return res.status(400).json({
        success: false,
        message:
          "The provided email address is already associated with a verified account. Please use an alternate email address or contact support for assistance.",
      });
    }

    if (existingUserByPhone && existingUserByPhone.IsVerified) {
      return res.status(400).json({
        success: false,
        message:
          "The provided mobile number is already linked to a verified account. Kindly use an alternate number or contact support for further guidance.",
      });
    }

    // generate otps
    const EmailOtp = generateOtp();
    const phoneotp = await sendOtp(Mobile);
    const PhoneOtp = phoneotp.data.verificationId; // Assuming you have a generateOtp utility for generating OTPs
    const OtpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    const newUserLog = new UserLogs({
      Email,
      PhoneNumber: Mobile,
      EmailOtp,
      PhoneOtp,
      OtpExpires,
      CreatedOn: new Date(),
      UpdatedOn: new Date(),
    });

    await newUserLog.save();

    await SendMail(
      newUserLog.Email,
      "Book My Cold Store : OTP Authentication",
      EmailOtp
    );
    // await SendSms(newUserLog.PhoneNumber, `Your OTP is ${PhoneOtp}`);

    res.status(201).json({
      success: true,
      message:
        "One-Time Passwords (OTPs) have been dispatched to the registered email address and mobile number. Please check your inbox and messages to proceed.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "We encountered an issue during the user registration process. Please try again later. If the problem persists, contact support for assistance.",
      error: error.message,
    });
  }
};

exports.submitUserDetails = async (req, res) => {
  try {
    const { Email, PhoneNumber, FirstName, LastName, PhoneOtp, EmailOtp } =
      req.body;

    // Validate input
    if (!Email || !PhoneNumber) {
      return res.status(400).json({
        success: false,
        message:
          "Email and phone number are mandatory fields. Please provide the required information to proceed.",
      });
    }

    if (!FirstName || !LastName) {
      return res.status(400).json({
        success: false,
        message:
          "irst name and last name are mandatory fields. Please provide the required information to proceed.",
      });
    }
    // Verify Email OTP
    try {
      const emailOtpResponse = await verifyEmailOtpFunction(Email, EmailOtp);
      const phoneOtpResponse = await verifyPhoneOtpFunction(
        PhoneNumber,
        PhoneOtp
      );

      if (!emailOtpResponse.success && !phoneOtpResponse.success) {
        return res.status(400).json({
          success: false,
          message:
            "Verification failed for both the email and phone OTPs. Please ensure the provided OTPs are correct and try again.",
        });
      }

      if (!emailOtpResponse.success) {
        return res.status(400).json({
          success: false,
          message:
            "The email OTP verification failed. Please verify the OTP and try again.",
        });
      }

      if (!phoneOtpResponse.success) {
        return res.status(400).json({
          success: false,
          message:
            "The phone OTP verification failed. Please check the OTP and try again.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        message:
          "An unexpected error occurred while verifying the email or phone OTP. Please try again later.",
      });
    }

    // Find the user using Email or PhoneNumber
    const user = await User.findOne({
      $or: [{ Email }, { PhoneNumber }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "The specific user could not be located. Please verify the details provided and try again.",
      });
    }

    // Check if the user is verified
    if (!user.IsVerified) {
      return res.status(400).json({
        success: false,
        message:
          "The user exists but has not yet been verified. Please complete the verification process to proceed.",
      });
    }

    // Update the user's name details
    await user.updateOne({
      FirstName,
      LastName,
      UpdatedOn: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "The user's information has been successfully updated.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "We encountered an unexpected issue while creating the user account. Please try again later or contact support if the problem persists.",
      error: error.message,
    });
  }
};

// Create a new User
exports.createUser = async (req, res) => {
  try {
    const { Email, PhoneNumber } = req.body;

    if (!Email || !PhoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Both Email and Phone Number are required.",
      });
    }

    const newUser = new User({
      Email,
      PhoneNumber,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      data: newUser,
      message: "The user has been successfully created.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "An error occurred while creating the user. Please try again later.",
      error: error.message,
    });
  }
};

// Get all Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().populate("GeoLocationId");
    res.status(200).json({
      success: true,
      data: users,
      message: "The users have been fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching users. Please try again later.",
      error: error.message,
    });
  }
};

// Get a User by ID
exports.getUserById = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "The User ID is required to proceed.",
      });
    }
    const user = await User.findById(req.params.id).populate({
      path: "GeoLocationId", // Populate GeoLocationId
      populate: [
        {
          path: "State", // Populate the State field
          select: "StateName", // Specify the fields you want to retrieve
        },
        {
          path: "Country", // Populate the Country field
          select: "CountryName", // Specify the fields you want to retrieve
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "The user could not be found. Please verify the provided information and try again.",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
      message: "The user have been fetched successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user. Please try again later.",
      error: error.message,
    });
  }
};

// Update a User
exports.updateUser = async (req, res) => {
  try {
    // Extract user data from req.body
    const userId = req.params.id;
    const {
      PhoneNumber,
      FirstName,
      LastName,
      GeoLocationData, // GeoLocation fields
      IsActive,
      IsDeleted,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "The User ID is required to proceed.",
      });
    }

    // First, update or create the GeoLocation data if provided
    let geoLocation;
    if (GeoLocationData) {
      // Check if GeoLocation already exists, otherwise create a new one
      if (GeoLocationData._id) {
        geoLocation = await GeoLocation.findByIdAndUpdate(
          GeoLocationData._id,
          { ...GeoLocationData, UpdatedOn: Date.now() },
          { new: true }
        );
      } else {
        geoLocation = new GeoLocation({
          ...GeoLocationData,
          CreatedOn: Date.now(),
        });
        await geoLocation.save();
      }
    }

    // Now, update the user's profile with the provided data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        PhoneNumber,
        FirstName,
        LastName,
        GeoLocationId: geoLocation ? geoLocation._id : undefined, // Set GeoLocationId if geoLocation exists
        IsActive,
        IsDeleted,
        UpdatedOn: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message:
          "The user could not be located. Please ensure that the provided information is correct and try again.",
      });
    }

    // Return the updated user data
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "The user's profile has been successfully updated.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the user's profile. Please try again later.",
      error: error.message,
    });
  }
};

// Delete a User
exports.deleteUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if user ID is provided
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: "The User ID is required to proceed.",
      });
    }

    // Find the user by ID
    const user = await User.findById(req.params.id).session(session);

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "The user could not be located. Please ensure that the provided information is correct and try again.",
      });
    }

    // If user has a GeoLocation, delete it
    if (user.GeoLocationId) {
      const geoLocation = await GeoLocation.findById(
        user.GeoLocationId
      ).session(session);
      if (geoLocation) {
        await geoLocation.remove();
      }
    }

    // Now delete the user
    await user.remove({ session });

    // Commit the transaction if both deletions succeed
    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message:
        "The user and the associated GeoLocation have been successfully deleted.",
    });
  } catch (error) {
    // If any error occurs, abort the transaction
    await session.abortTransaction();
    session.endSession();

    console.error(error);
    res.status(500).json({
      success: false,
      message:
        "An error occurred while deleting the user and/or the associated GeoLocation. Please try again later.",
      error: error.message,
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    // Extract user data from req.body
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token is not provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    const profiledata = JSON.parse(req.body.profiledata);

    const {
      // PhoneNumber,
      FirstName,
      LastName,
      GeoLocationData, // GeoLocation fields
      IsActive,
      IsDeleted,
    } = profiledata;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "The User ID is required to proceed.",
      });
    }

    if (req.file && req.file.fieldname === "ProfilePicture") {
      const profilepicture = req.file;
      profiledata.ProfilePicture = await uploadAzureFileInController(
        profilepicture,
        "profilepictures"
      );
    }
    // First, update or create the GeoLocation data if provided
    let geoLocation;
    if (GeoLocationData) {
      // Check if GeoLocation already exists, otherwise create a new one
      if (GeoLocationData._id) {
        geoLocation = await GeoLocation.findByIdAndUpdate(
          GeoLocationData._id,
          { ...GeoLocationData, UpdatedOn: Date.now() },
          { new: true }
        );
      } else {
        geoLocation = new GeoLocation({
          ...GeoLocationData,
          CreatedOn: Date.now(),
        });
        await geoLocation.save();
      }
    }

    // Now, update the user's profile with the provided data
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        // PhoneNumber,
        FirstName,
        LastName,
        ...profiledata,
        GeoLocationId: geoLocation ? geoLocation._id : undefined, // Set GeoLocationId if geoLocation exists
        IsActive,
        IsDeleted,
        UpdatedOn: Date.now(),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message:
          "The user could not be located. Please ensure that the provided information is correct and try again.",
      });
    }

    // Return the updated user data
    res.status(200).json({
      success: true,
      data: updatedUser,
      message: "The user's profile has been successfully updated.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the profile. Please try again later.",
      error: error.message,
    });
  }
};

// get user using req.body.userId
exports.getUserByToken = async (req, res) => {
  try {
    const user = await User.findById(req.body.user).populate({
      path: "GeoLocationId", // Populate GeoLocationId
      populate: [
        {
          path: "State", // Populate the State field
          select: "StateName", // Specify the fields you want to retrieve
        },
        {
          path: "Country", // Populate the Country field
          select: "CountryName", // Specify the fields you want to retrieve
        },
      ],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message:
          "The user could not be located. Please ensure that the provided information is correct and try again.",
      });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching the user's information. Please try again later.",
      error: error.message,
    });
  }
};
