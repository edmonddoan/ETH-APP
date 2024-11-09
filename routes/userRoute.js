const express = require('express');
const { AppError } = require('../lib/errorHandler');
const { formatResponse } = require('../lib/responseHandler');
const asyncHandler = require('../middleware/asyncHandler');

const router = express.Router();

router.get('/users', asyncHandler(async (req, res) => {
  const users = await User.find();
  
  if (!users.length) {
    throw new AppError('No users found', 404);
  }

  res.json(formatResponse(users, 'Users retrieved successfully'));
}));

router.post('/users', asyncHandler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    throw new AppError('Name and email are required', 400);
  }

  const user = await User.create({ name, email });
  res.status(201).json(formatResponse(user, 'User created successfully', 201));
})); 