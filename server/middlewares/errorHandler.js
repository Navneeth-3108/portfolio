const AppError = require("../utils/AppError");

const notFoundHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Avoid stack-trace noise for expected client-side operational errors.
  if (isOperational && statusCode < 500) {
    console.warn(`[Warn] ${statusCode} - ${err.message}`);
  } else {
    console.error(
      `[Error] ${statusCode} - ${isOperational ? err.message : "Internal server error"}`,
      err
    );
  }

  res.status(statusCode).json({
    success: false,
    message: isOperational ? err.message : "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
