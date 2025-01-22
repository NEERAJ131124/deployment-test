const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = async (req, res, next) => {
  try {
    const token =
      req.headers.authorization && req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ msg: "Token is not provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ msg: "Token is not valid" });
    }
    req.body.user = decoded.userId;
    next();
  } catch (error) {
    console.error(error.message);
    console.log("error");
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError" ||
      error.message === "jwt expired" ||
      error.message === "invalid token" ||
      error.message === "jwt must be provided"
    ) {
      return res.status(401).json({ msg: "Token expired" });
    }
    res.status(401).json({ msg: "Token is not valid" });
  }
};
