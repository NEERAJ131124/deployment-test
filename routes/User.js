const express = require("express");
const router = express.Router();
const {
  // createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  updateProfile,
  getUserByToken,
  // sendEmailOtp,
  // verifyEmailOtp,
  registerUser,
  // verifyPhoneOtp,
  submitUserDetails
} = require("../controllers/User");
const { auth } = require("../middlewares/Auth");
const { uploadProfilePicture } = require("../middlewares/upload");

// /**
//  * @swagger
//  * /user:
//  *   post:
//  *     summary: Create a new user
//  *     tags: [User]
//  *     description: Registers a new user by providing necessary details like email and phone number.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               Email:
//  *                 type: string
//  *                 description: User's email address.
//  *               PhoneNumber:
//  *                 type: string
//  *                 description: User's phone number.
//  *     responses:
//  *       201:
//  *         description: User created successfully.
//  *       400:
//  *         description: Email and PhoneNumber are required.
//  *       500:
//  *         description: Internal server error.
//  */
// router.post("/", createUser);

/**
 * @swagger
 * /user/profile:
 *   post:
 *     summary: Update user profile by token
 *     tags: [User]
 *     description: Allows authenticated users to update their profile details including phone number, name, and geo-location.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *              
 *               PhoneNumber:
 *                 type: string
 *                 description: User's new phone number.
 *               FirstName:
 *                 type: string
 *                 description: User's first name.
 *               LastName:
 *                 type: string
 *                 description: User's last name.
 *               GeoLocationData:
 *                 type: object
 *                 properties:
 *                   StreetAddress:
 *                     type: string
 *                     maxlength: 255
 *                     description: The user's street address.
 *                   District:
 *                     type: string
 *                     maxlength: 100
 *                     description: The district of the user.
 *                   City:
 *                     type: string
 *                     maxlength: 100
 *                     description: The city of the user.
 *                   State:
 *                     type: string
 *                     maxlength: 100
 *                     description: The state of the user.
 *                   Region:
 *                     type: string
 *                     maxlength: 100
 *                     description: The region of the user (optional).
 *                   Country:
 *                     type: string
 *                     maxlength: 100
 *                     description: The country of the user.
 *                   Pincode:
 *                     type: string
 *                     maxlength: 20
 *                     description: The pincode of the user's location.
 *                   Latitude:
 *                     type: number
 *                     description: The latitude coordinate of the user's location.
 *                   Longitude:
 *                     type: number
 *                     description: The longitude coordinate of the user's location.
 *                   IsActive:
 *                     type: boolean
 *                     description: Whether the geo-location is active or not.
 *                   IsDeleted:
 *                     type: boolean
 *                     description: Whether the geo-location is deleted or not.
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: User ID is required.
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.post("/profile", uploadProfilePicture, updateProfile);

/**
 * @swagger
 * /user/verifyphoneotp:
 *   post:
 *     summary: Verify phone OTP
 *     tags: [User Verification]
 *     description: Verifies the phone number of a user using an OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               PhoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               PhoneOtp:
 *                 type: string
 *                 description: The OTP sent to the user's phone.
 *     responses:
 *       200:
 *         description: Phone number verified successfully.
 *       400:
 *         description: Invalid or expired OTP.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error verifying OTP.
 */
// router.post("/verifyphoneotp", verifyPhoneOtp);

/**
 * @swagger
 * /user/verifyemailotp:
 *   post:
 *     summary: Verify email OTP
 *     tags: [User Verification]
 *     description: Verifies the email of a user using an OTP.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 description: The email address of the user.
 *               EmailOtp:
 *                 type: string
 *                 description: The OTP sent to the user's email.
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid or expired OTP.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Error verifying OTP.
 */
// router.post("/verifyemailotp", verifyEmailOtp);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     description: Registers a new user by creating a user log and sending OTPs to their email and phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: test@example.com
 *               Mobile:
 *                 type: string
 *                 description: The phone number of the user.
 *                 example: "1234567890"
 *     responses:
 *       201:
 *         description: User log created successfully. OTPs sent to email and phone number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User log created successfully. OTPs sent to email and phone number."
 *       400:
 *         description: Bad Request - Missing fields or user already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Email and PhoneNumber are required."
 *       500:
 *         description: Internal Server Error - Unexpected error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Error registering user."
 *                 error:
 *                   type: string
 *                   example: "Detailed error message."
 */
router.post("/register", registerUser);


/**
 * @swagger
 * /user/createUser:
 *   post:
 *     summary: Submit user details
 *     tags: [User]
 *     description: Updates the user's name details if their email and phone number are verified.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 description: The email address of the user.
 *               PhoneNumber:
 *                 type: string
 *                 description: The phone number of the user.
 *               FirstName:
 *                 type: string
 *                 description: The first name of the user.
 *               LastName:
 *                 type: string
 *                 description: The last name of the user.
 *               EmailOtp:
 *                 type: string
 *                 description: The OTP for email verification.
 *               PhoneOtp:
 *                 type: string
 *                 description: The OTP for phone verification.
 *     responses:
 *       200:
 *         description: User details updated successfully.
 *       403:
 *         description: User is not verified. Cannot update details.
 *       404:
 *         description: User not found.
 *       400:
 *         description: Missing required fields or invalid OTP.
 *       500:
 *         description: Error updating user details.
 */
router.post("/createUser", submitUserDetails);


/**
 * @swagger
 * /user/getUser:
 *   get:
 *     summary: Get user details by token
 *     tags: [User]
 *     description: Retrieve the logged-in user's details using the provided authentication token.
 *     security:
 *       - bearerAuth: []
 * 
 *     responses:
 *       200:
 *         description: User details fetched successfully.
 *       401:
 *         description: Unauthorized, token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */
router.get("/getUser", auth, getUserByToken);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     description: Retrieves a list of all users along with their associated GeoLocation data.
 *     responses:
 *       200:
 *         description: List of users.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getAllUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [User]
 *     description: Retrieves a user by their unique ID and populates the GeoLocation data.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to retrieve.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.get("/:id",auth, getUserById);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user details by ID
 *     tags: [User]
 *     description: Updates the user details by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: User ID.
 *               PhoneNumber:
 *                 type: string
 *                 description: User's new phone number.
 *               FirstName:
 *                 type: string
 *                 description: User's first name.
 *               LastName:
 *                 type: string
 *                 description: User's last name.
 *               GeoLocationData:
 *                 type: object
 *                 properties:
 *                   StreetAddress:
 *                     type: string
 *                     maxlength: 255
 *                     description: The user's street address.
 *                   District:
 *                     type: string
 *                     maxlength: 100
 *                     description: The district of the user.
 *                   City:
 *                     type: string
 *                     maxlength: 100
 *                     description: The city of the user.
 *                   State:
 *                     type: string
 *                     maxlength: 100
 *                     description: The state of the user.
 *                   Region:
 *                     type: string
 *                     maxlength: 100
 *                     description: The region of the user (optional).
 *                   Country:
 *                     type: string
 *                     maxlength: 100
 *                     description: The country of the user.
 *                   Pincode:
 *                     type: string
 *                     maxlength: 20
 *                     description: The pincode of the user's location.
 *                   Latitude:
 *                     type: number
 *                     description: The latitude coordinate of the user's location.
 *                   Longitude:
 *                     type: number
 *                     description: The longitude coordinate of the user's location.
 *                   IsActive:
 *                     type: boolean
 *                     description: Whether the geo-location is active or not.
 *                   IsDeleted:
 *                     type: boolean
 *                     description: Whether the geo-location is deleted or not.
 *     responses:
 *       200:
 *         description: User updated successfully.
 *       400:
 *         description: Invalid input data.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [User]
 *     description: Deletes a user by their unique ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteUser);

module.exports = router;
