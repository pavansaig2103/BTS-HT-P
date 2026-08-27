const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/supabase');
const { generateToken } = require('../utils/jwt');
const AppError = require('../utils/AppError');

class AuthService {
  async register({ name, email, password, preferredLanguage = 'en', explanationLevel = 'simple' }) {
    // Check existing email
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (existingUser) {
      throw new AppError('An account with this email address already exists.', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    // 1. Create User
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert({
        id: userId,
        name,
        email: email.toLowerCase(),
        password_hash: passwordHash,
      })
      .select('id, name, email, created_at')
      .single();

    if (userError || !user) {
      throw new AppError(`User registration failed: ${userError?.message || 'DB Error'}`, 500, 'DB_ERROR');
    }

    // 2. Create User Accessibility Profile
    await supabase.from('user_accessibility_profiles').insert({
      id: uuidv4(),
      user_id: user.id,
      preferred_language: preferredLanguage,
      explanation_level: explanationLevel,
      guidance_mode: 'step_by_step',
    });

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        preferred_language: preferredLanguage,
        explanation_level: explanationLevel,
      },
      token,
    };
  }

  async login({ email, password }) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, password_hash, created_at')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !user) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Invalid email or password.', 401, 'INVALID_CREDENTIALS');
    }

    // Fetch accessibility profile
    const { data: profile } = await supabase
      .from('user_accessibility_profiles')
      .select('preferred_language, explanation_level, guidance_mode')
      .eq('user_id', user.id)
      .single();

    const token = generateToken({ id: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
        preferred_language: profile?.preferred_language || 'en',
        explanation_level: profile?.explanation_level || 'simple',
        guidance_mode: profile?.guidance_mode || 'step_by_step',
      },
      token,
    };
  }

  async getMe(userId) {
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, created_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new AppError('User not found.', 404, 'USER_NOT_FOUND');
    }

    const { data: profile } = await supabase
      .from('user_accessibility_profiles')
      .select('preferred_language, explanation_level, guidance_mode')
      .eq('user_id', user.id)
      .single();

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      profile: profile || {
        preferred_language: 'en',
        explanation_level: 'simple',
        guidance_mode: 'step_by_step',
      },
    };
  }
}

module.exports = new AuthService();
