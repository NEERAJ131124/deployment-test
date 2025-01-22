const express = require("express");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");

const router = express.Router();

// Azure B2C configuration
const tenantName = "coldstorageb2c";
const policyName = "B2C_1_csui";
const clientId = "868dbdf5-5215-4192-a482-42e1ae3aa835";
const clientSecret = "98efc6f1-a556-45d4-80e8-1ac101d492df";
const redirectUri = "http://localhost:5173/dashboard";
const tokenEndpoint = `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/oauth2/v2.0/token?p=${policyName}`;

// JWKS client for token verification
const client = jwksClient({
  jwksUri: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/discovery/v2.0/keys?p=${policyName}`,
});

const getKey = (header, callback) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err, null);
    } else {
      const signingKey = key.getPublicKey();
      callback(null, signingKey);
    }
  });
};

router.post("/", async (req, res) => {

  if (!req?.body?.code) {
    return res.status(400).json({ error: "Authorization code is required" });
  }

  const { code } = req.body;

  try {
    // Exchange code for tokens
    const tokenResponse = await axios.post(
      tokenEndpoint,
      new URLSearchParams({
        client_id: clientId,
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_secret: clientSecret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { id_token, access_token } = tokenResponse.data;

    // Verify the ID token
    jwt.verify(
      id_token,
      getKey,
      {
        algorithms: ["RS256"],
        audience: clientId,
        issuer: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/v2.0/`,
      },
      (err, decoded) => {
        if (err) {
          console.error("Token verification failed:", err);
          return res.status(401).json({ error: "Invalid token" });
        }

        return res.json({ message: "Login successful", decoded, access_token });
      }
    );
  } catch (error) {
    console.error("Error during token exchange:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to exchange code for tokens" });
  }
});

module.exports = router;
