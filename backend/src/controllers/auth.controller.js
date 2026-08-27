const authService = require('../services/auth.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  return successResponse(res, result, 201);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  return successResponse(res, result, 200);
});

const getMe = asyncHandler(async (req, res) => {
  const user = await authService.getMe(req.user.id);
  return successResponse(res, { user }, 200);
});

module.exports = {
  register,
  login,
  getMe,
};
