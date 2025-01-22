const express = require("express");
const { verifyOtp, sendOtp } = require("../controllers/UserLogs");
const router = express.Router();

/**
 * @swagger
 * /login/login-or-signup:
 *   post:
 *     summary: Send OTP
 *     tags: [Login]    
 *     description: Sends an OTP to the user's email or phone number for login or signup.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 description: User's email or phone number.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *       400:
 *         description: Invalid input or request.
 *       500:
 *         description: Internal server error.
 */
router.post("/login-or-signup", sendOtp);

/**
 * @swagger
 * /login/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     tags: [Login]
 *     description: Verifies the OTP sent to the user's email or phone number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               Email:
 *                 type: string
 *                 description: User's email or phone number.
 *               Otp:
 *                 type: string
 *                 description: OTP received by the user.
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *       400:
 *         description: Invalid OTP or request.
 *       500:
 *         description: Internal server error.
 */
router.post("/verify-otp", verifyOtp);

module.exports = router;
