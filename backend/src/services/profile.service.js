const { supabase } = require('../config/supabase');
const AppError = require('../utils/AppError');
const { v4: uuidv4 } = require('uuid');

class ProfileService {
  async getProfile(userId) {
    const { data: profile, error } = await supabase
      .from('user_accessibility_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !profile) {
      // Auto create default profile if missing
      const defaultProfile = {
        id: uuidv4(),
        user_id: userId,
        preferred_language: 'en',
        explanation_level: 'simple',
        guidance_mode: 'step_by_step',
      };
      await supabase.from('user_accessibility_profiles').insert(defaultProfile);
      return defaultProfile;
    }

    return profile;
  }

  async updateProfile(userId, updates) {
    const allowed = ['preferred_language', 'explanation_level', 'guidance_mode'];
    const filteredUpdates = {};
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        filteredUpdates[key] = updates[key];
      }
    }

    const { data: updated, error } = await supabase
      .from('user_accessibility_profiles')
      .update(filteredUpdates)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new AppError(`Failed to update accessibility profile: ${error.message}`, 500, 'DB_ERROR');
    }

    return this.getProfile(userId);
  }
}

module.exports = new ProfileService();
