const { z } = require('zod');

const updateProfileSchema = z.object({
  body: z.object({
    preferred_language: z.enum(['en', 'te']).optional(),
    explanation_level: z.enum(['simple', 'detailed']).optional(),
    guidance_mode: z.enum(['step_by_step']).optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one profile field must be provided for update',
  }),
});

module.exports = {
  updateProfileSchema,
};
