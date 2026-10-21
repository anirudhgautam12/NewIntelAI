import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Register a new user
 * Route: POST /api/auth/register
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const lowercaseEmail = email.toLowerCase();

  const userExists = await User.findOne({ email: lowercaseEmail });
  if (userExists) {
    throw new ApiError(400, 'A user with this email address already exists');
  }

  // Hash password explicitly using bcryptjs (not using pre-save hooks)
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email: lowercaseEmail,
    password: hashedPassword,
    role: role || 'user'
  });

  const token = generateToken(user._id);

  // Structure response, excluding password field
  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  res.status(201).json(new ApiResponse(201, { user: userResponse, token }, 'Registration successful'));
});

/**
 * Login existing user
 * Route: POST /api/auth/login
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  // Find user and explicitly select password field
  const user = await User.findOne({ email: lowercaseEmail }).select('+password');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id);

  const userResponse = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  res.status(200).json(new ApiResponse(200, { user: userResponse, token }, 'Login successful'));
});

/**
 * Get currently authenticated user profile
 * Route: GET /api/auth/me
 */
export const getMe = asyncHandler(async (req, res) => {
  const userResponse = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    createdAt: req.user.createdAt,
    updatedAt: req.user.updatedAt
  };

  res.status(200).json(new ApiResponse(200, userResponse, 'User profile retrieved successfully'));
});
