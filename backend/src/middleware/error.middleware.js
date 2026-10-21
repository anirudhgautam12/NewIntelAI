import { ApiError } from '../utils/ApiError.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Normalize all errors into ApiError instances
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, error.errors || [], error.stack);
  }

  // Mongoose CastError (e.g. invalid ObjectId format)
  if (err.name === 'CastError') {
    error = new ApiError(400, `Resource not found with id of ${err.value}`);
  }

  // MongoDB duplicate key error (code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    error = new ApiError(400, `Duplicate field value entered: ${field}`);
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message);
    error = new ApiError(400, `Validation Error: ${messages.join(', ')}`);
  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Your token has expired. Please log in again.');
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors || []
  };

  // Only expose stack trace if explicitly set to development env
  if (process.env.NODE_ENV === 'development') {
    response.stack = error.stack;
  }

  res.status(error.statusCode || 500).json(response);
};
