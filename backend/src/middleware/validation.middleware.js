import { ApiError } from '../utils/ApiError.js';

export const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2 || name.trim().length > 50) {
    return next(new ApiError(400, 'Name must be between 2 and 50 characters'));
  }

  // Simple email pattern check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    return next(new ApiError(400, 'Please provide a valid email address'));
  }

  if (!password || password.length < 6) {
    return next(new ApiError(400, 'Password must be at least 6 characters long'));
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, 'Email and password are required'));
  }

  next();
};

export const validateAnalyze = (req, res, next) => {
  const { inputType, articleText, articleUrl, summaryLength } = req.body;

  if (!inputType || !['text', 'url'].includes(inputType)) {
    return next(new ApiError(400, 'inputType is required and must be either "text" or "url"'));
  }

  if (inputType === 'text') {
    if (!articleText || articleText.trim().length < 100) {
      return next(new ApiError(400, 'articleText must be at least 100 characters long'));
    }
  }

  if (inputType === 'url') {
    if (!articleUrl) {
      return next(new ApiError(400, 'articleUrl is required for url-based analysis'));
    }
    // Basic HTTP/HTTPS protocol validation
    if (!articleUrl.startsWith('http://') && !articleUrl.startsWith('https://')) {
      return next(new ApiError(400, 'Invalid articleUrl. Only http and https protocols are allowed.'));
    }
  }

  if (summaryLength && !['short', 'medium', 'detailed'].includes(summaryLength)) {
    return next(new ApiError(400, 'summaryLength must be short, medium, or detailed'));
  }

  next();
};

export const validateAsk = (req, res, next) => {
  const { question } = req.body;

  if (!question || question.trim().length === 0) {
    return next(new ApiError(400, 'Question must be a non-empty string'));
  }

  next();
};
