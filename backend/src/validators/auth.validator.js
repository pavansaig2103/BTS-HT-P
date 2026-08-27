const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    preferredLanguage: z.enum(['en', 'te']).optional().default('en'),
    explanationLevel: z.enum(['simple', 'detailed']).optional().default('simple'),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

module.exports = {
  registerSchema,
  loginSchema,
};
