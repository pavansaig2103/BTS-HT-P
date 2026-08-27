const { z } = require('zod');

const adaptationSchema = z.object({
  officialText: z.string(),
  adaptedExplanation: z.string(),
  language: z.enum(['en', 'te']),
  explanationLevel: z.enum(['simple', 'detailed']),
  confidence: z.enum(['confirmed', 'uncertain']).default('confirmed'),
  keyTermsExplained: z.array(
    z.object({
      term: z.string(),
      explanation: z.string(),
    })
  ).optional().default([]),
});

module.exports = {
  adaptationSchema,
};
