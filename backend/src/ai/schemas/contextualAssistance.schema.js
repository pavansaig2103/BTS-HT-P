const { z } = require('zod');

const contextualAssistanceSchema = z.object({
  answer: z.string().min(1),
  grounded: z.boolean().default(true),
  confidence: z.enum(['confirmed', 'uncertain']).default('confirmed'),
  sources: z.array(z.string()).optional().default([]),
  uncertaintyNote: z.string().optional().default(''),
  actionableTip: z.string().optional().default(''),
});

module.exports = {
  contextualAssistanceSchema,
};
