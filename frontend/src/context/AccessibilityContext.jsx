import React, { createContext, useContext, useState, useEffect } from 'react';
import { profileApi } from '../services/profileApi';
import { useAuth } from './AuthContext';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const { user, isAuthenticated, updateUserProfileState } = useAuth();
  const [language, setLanguage] = useState('en'); // 'en' | 'te'
  const [explanationLevel, setExplanationLevel] = useState('simple'); // 'simple' | 'detailed'
  const [guidanceMode, setGuidanceMode] = useState('step_by_step');
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState('normal'); // 'normal' | 'large' | 'xlarge'
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.profile) {
      setLanguage(user.profile.preferred_language || 'en');
      setExplanationLevel(user.profile.explanation_level || 'simple');
      setGuidanceMode(user.profile.guidance_mode || 'step_by_step');
    }
  }, [user]);

  const updatePreferences = async (newPrefs) => {
    if (newPrefs.language) setLanguage(newPrefs.language);
    if (newPrefs.explanationLevel) setExplanationLevel(newPrefs.explanationLevel);
    if (newPrefs.guidanceMode) setGuidanceMode(newPrefs.guidanceMode);
    if (newPrefs.highContrast !== undefined) setHighContrast(newPrefs.highContrast);
    if (newPrefs.fontSize) setFontSize(newPrefs.fontSize);

    if (isAuthenticated) {
      setSaving(true);
      try {
        const payload = {};
        if (newPrefs.language) payload.preferred_language = newPrefs.language;
        if (newPrefs.explanationLevel) payload.explanation_level = newPrefs.explanationLevel;
        if (newPrefs.guidanceMode) payload.guidance_mode = newPrefs.guidanceMode;

        if (Object.keys(payload).length > 0) {
          const res = await profileApi.updateProfile(payload);
          if (res.success && res.data?.profile) {
            updateUserProfileState(res.data.profile);
          }
        }
      } catch (err) {
        console.warn('Failed to sync profile update to backend:', err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <AccessibilityContext.Provider
      value={{
        language,
        explanationLevel,
        guidanceMode,
        highContrast,
        fontSize,
        saving,
        setLanguage: (lang) => updatePreferences({ language: lang }),
        setExplanationLevel: (lvl) => updatePreferences({ explanationLevel: lvl }),
        setHighContrast: (hc) => updatePreferences({ highContrast: hc }),
        setFontSize: (size) => updatePreferences({ fontSize: size }),
        updatePreferences,
      }}
    >
      <div className={`${highContrast ? 'contrast-125 saturate-150' : ''} ${fontSize === 'large' ? 'text-lg' : fontSize === 'xlarge' ? 'text-xl' : 'text-base'}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export default AccessibilityContext;
