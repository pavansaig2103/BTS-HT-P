const { verifyToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { supabase } = require('../config/supabase');

const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED'));
  }

  try {
    const decoded = verifyToken(token);

    // Fetch current user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', decoded.id)
      .single();

    if (error || !user) {
      return next(new AppError('User belonging to this token no longer exists.', 401, 'UNAUTHORIZED'));
    }

    req.user = user;
    next();
  } catch (err) {
    return next(new AppError('Invalid or expired token.', 401, 'INVALID_TOKEN'));
  }
});

module.exports = { authenticate };
