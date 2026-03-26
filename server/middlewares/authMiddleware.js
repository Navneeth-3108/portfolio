const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Not authorized", 401));
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));
  }
};

module.exports = authMiddleware;
