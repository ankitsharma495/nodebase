// ===========================================
// Global Error Handling Middleware
// ===========================================

const logger = require('../utils/logger');

const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational || false;

  // Log error
  if (!isOperational) {
    logger.error('Unhandled error', {
      message: err.message,
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
    });
  } else {
    logger.warn('Operational error', {
      message: err.message,
      statusCode,
      path: req.originalUrl,
    });
  }

  // Prisma known errors
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      data: null,
      message: 'A record with this value already exists.',
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      data: null,
      message: 'Record not found.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Invalid token. Please log in again.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      data: null,
      message: 'Token expired. Please log in again.',
    });
  }

  return res.status(statusCode).json({
    success: false,
    data: null,
    message: isOperational ? err.message : 'Internal server error',
  });
};

module.exports = errorHandler;
