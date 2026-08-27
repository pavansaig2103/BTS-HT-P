const { GoogleGenerativeAI } = require('@google/generative-ai');
const env = require('../../config/env');
const { adaptationSchema } = require('../../ai/schemas/adaptation.schema');
const { getAdaptationPrompt } = require('../../ai/prompts/adaptation.prompt');

class AccessibilityAdaptationService {
  constructor() {
    this.cache = new Map(); // Simple in-memory adaptation cache
    if (env.GEMINI_API_KEY && !env.GEMINI_API_KEY.includes('your-gemini')) {
      try {
        this.genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      } catch (e) {
        console.warn('⚠️ Gemini initialization warning:', e.message);
      }
    }
  }

  cleanJsonString(str) {
    let clean = str.trim();
    if (clean.startsWith('```')) {
      clean = clean.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
    }
    return clean.trim();
  }

  /**
   * Adapts text to target language and complexity level
   */
  async adaptText({ officialText, language = 'en', explanationLevel = 'simple' }) {
    const cacheKey = `${language}:${explanationLevel}:${officialText.trim()}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // Default heuristic adaptation for fast offline/fallback responses
    const fallback = {
      officialText,
      adaptedExplanation:
        language === 'te'
          ? `[తెలుగు వివరణ]: ఈ దశలో మీరు అవసరమైన పత్రాలను సిద్ధం చేసుకోవాలి మరియు వివరాలను ధృవీకరించుకోవాలి. (${officialText})`
          : explanationLevel === 'detailed'
          ? `Detailed Breakdown: Please review the official requirement carefully. Ensure all certificates, academic numbers, and verification seals are obtained before moving to the next step. Original requirement: ${officialText}`
          : `Simple Summary: ${officialText}`,
      language,
      explanationLevel,
      confidence: 'confirmed',
      keyTermsExplained: [],
    };

    if (!this.model) {
      this.cache.set(cacheKey, fallback);
      return fallback;
    }

    try {
      const prompt = getAdaptationPrompt({ officialText, language, explanationLevel });
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.2,
          responseMimeType: 'application/json',
        },
      });

      const cleaned = this.cleanJsonString(result.response.text());
      const parsed = JSON.parse(cleaned);
      const validated = adaptationSchema.safeParse(parsed);

      if (validated.success) {
        this.cache.set(cacheKey, validated.data);
        return validated.data;
      }
      return fallback;
    } catch (err) {
      console.warn('⚠️ Adaptation service error, utilizing fallback adaptation:', err.message);
      return fallback;
    }
  }
}

module.exports = new AccessibilityAdaptationService();
