const jwt = require("jsonwebtoken");

// checks for a valid JWT token
function checkAuthToken(req, res, next) {

  // gets the token from the auth header
  const authHeader = req.headers.authorization;


  // checks for a missing header, blocks request if thats the case
  if (!authHeader) {
    return res.status(401).json({ message: "Token missing!" });
  }

  const token = authHeader.split(" ")[1];

  try {

    // compares client given key with env secret key
    const userData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = userData;
    next();

  } catch (err) {
    
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = checkAuthToken;
