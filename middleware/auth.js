const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Extract the token from the request headers
    const token = req.headers.authorization.split(" ")[1];
    // Verify the token using the secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // Assign the decoded token to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Auth failed",
    });
  }
};
