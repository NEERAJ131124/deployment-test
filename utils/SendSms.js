const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();

// Function to base64 encrypt a password
const base64Encrypt = (password) => {
  return Buffer.from(password).toString("base64");
};

// Function to generate an authentication token
const generateAuthToken = async () => {
  try {
    const response = await axios.get(
      "https://cpaas.messagecentral.com/auth/v1/authentication/token",
      {
        params: {
          customerId: process.env.CUSTOMER_ID,
          key: base64Encrypt(process.env.PASSWORD), // Your base-64 encrypted password
          scope: "NEW",
          country: 91,
          email: "amanwaliaus@gmail.com",
        },
        headers: {
          accept: "*/*",
        },
      }
    );

    if (response.status === 200) {
      return response.data.token;
    } else {
      console.error("Error generating token:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error generating token:", error.message);
    throw error;
  }
};

// Function to send OTP
const sendOtp = async (to) => {
  try {
    // const message = `Your OTP for Secure Login is: ${otp}`;
    const response = await axios.post(
      `https://cpaas.messagecentral.com/verification/v3/send?countryCode=91&customerId=C-E493254370494D7&flowType=SMS&mobileNumber=${to}&otpLength=6`,
      {},
      {
        headers: {
          authToken:
            "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUU0OTMyNTQzNzA0OTRENyIsImlhdCI6MTczNDYwMjQ2NiwiZXhwIjoxODkyMjgyNDY2fQ.66XukxhmOG0UvfikQK8HSKSKQ3K_7q1A2XkftlEAV637LXWxpdqyG9k1m1Nye471vnqAJ6uotnn0U1KJEJXGoA",
        },
      }
    );

    if (response.data && response.status === 200) {
      return response.data; // Assuming the response contains verificationId
    } else {
      console.error("Error sending SMS:", response.data);
      return 555555;
    }
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    throw error;
  }
};

// Function to validate OTP
const validateOtp = async (verificationId, otp) => {
  try {
    const apiUrl =
      "https://cpaas.messagecentral.com/verification/v3/validateOtp";
    const response = await axios.get(apiUrl, {
      params: {
        verificationId: verificationId,
        code: otp,
      },
      headers: {
        authToken:
          "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJDLUU0OTMyNTQzNzA0OTRENyIsImlhdCI6MTczNDYwMjQ2NiwiZXhwIjoxODkyMjgyNDY2fQ.66XukxhmOG0UvfikQK8HSKSKQ3K_7q1A2XkftlEAV637LXWxpdqyG9k1m1Nye471vnqAJ6uotnn0U1KJEJXGoA",
      },
    });
    if (response.data && response.status === 200) {
      return response.data;
    } else {
      console.error("Error validating OTP:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error validating OTP:", error.response);
    throw error;
  }
};

// Export the functions for use in other parts of your application
module.exports = {
  base64Encrypt,
  generateAuthToken,
  sendOtp,
  validateOtp,
};
