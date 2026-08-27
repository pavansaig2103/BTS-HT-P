const profileService = require('../services/profile.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.getProfile(req.user.id);
  return successResponse(res, { profile }, 200);
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await profileService.updateProfile(req.user.id, req.body);
  return successResponse(res, { profile }, 200);
});

module.exports = {
  getProfile,
  updateProfile,
};
