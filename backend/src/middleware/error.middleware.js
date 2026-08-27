const AppError = require('../utils/AppError');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let error = err;

  // Handle SyntaxError (JSON parse errors)
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    error = new AppError('Malformed JSON in request body', 400, 'INVALID_JSON');
  }

  // Handle Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error = new AppError('File size exceeds the 10MB limit', 400, 'FILE_TOO_LARGE');
    } else {
      error = new AppError(`File upload error: ${err.message}`, 400, 'UPLOAD_ERROR');
    }
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid authentication token', 401, 'INVALID_TOKEN');
  }
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Authentication token has expired', 401, 'TOKEN_EXPIRED');
  }

  const statusCode = error.statusCode || 500;
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  const message = error.message || 'An unexpected error occurred';
  const details = error.details || [];

  if (statusCode >= 500 && env.NODE_ENV !== 'test') {
    console.error('💥 Unhandled Error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
      ...(env.NODE_ENV === 'development' && statusCode >= 500 ? { stack: err.stack } : {}),
    },
  });
};

module.exports = errorHandler;
