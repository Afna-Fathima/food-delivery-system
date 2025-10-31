// Global Error Handler Middleware

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found with ID: ${err.value}`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return res.status(400).json({
      success: false,
      message,
    });
  }

  // JWT Token error
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please login again.';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // JWT Expired error
  if (err.name === 'TokenExpiredError') {
    const message = 'Your session has expired. Please login again.';
    return res.status(401).json({
      success: false,
      message,
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
    return res.status(400).json({
      success: false,
      message: messages,
    });
  }

  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

module.exports = { AppError, errorHandler };
