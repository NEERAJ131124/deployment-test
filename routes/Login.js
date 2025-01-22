const express = require("express");
const router = express.Router();
const { loginOrSignup, verifyOTP } = require("../controllers/Login");

router.post("/login-or-signup", loginOrSignup);
router.post("/verify-otp", verifyOTP);

module.exports = router;
