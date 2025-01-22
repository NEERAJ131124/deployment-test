const jwt = require("jsonwebtoken");



exports.verifyB2CToken = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token is missing" });
  
    try {
      const metadataUrl = `https://cs.b2clogin.com/10d95ef8-ab99-4b30-905b-4a92dd1f98d8.onmicrosoft.com/v2.0/.well-known/openid-configuration?p=B2C_1_cs`;
      const { data: metadata } = await axios.get(metadataUrl);
      const jwksUri = metadata.jwks_uri;
  
      // Fetch JWKS (JSON Web Key Set)
      const { data: jwks } = await axios.get(jwksUri);
      const publicKey = jwks.keys[0].x5c[0];
  
      // Verify Token
      jwt.verify(token, `-----BEGIN CERTIFICATE-----\n${publicKey}\n-----END CERTIFICATE-----`, {
        algorithms: ["RS256"],
      }, (err, decoded) => {
        if (err) throw err;
        req.user = decoded;
        next();
      });
    } catch (err) {
      return res.status(401).json({ error: "Invalid token", details: err.message });
    }
  };