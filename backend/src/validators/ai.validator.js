const { z } = require('zod');

const askAiSchema = z.object({
  body: z.object({
    workflowId: z.string().uuid('Invalid workflow ID format').optional(),
    stepId: z.string().uuid('Invalid step ID format').optional(),
    question: z.string().min(2, 'Question must be at least 2 characters').max(1000, 'Question too long'),
  }),
});

const adaptTextSchema = z.object({
  body: z.object({
    text: z.string().min(1, 'Text is required'),
    language: z.enum(['en', 'te']).optional().default('en'),
    explanationLevel: z.enum(['simple', 'detailed']).optional().default('simple'),
  }),
});

module.exports = {
  askAiSchema,
  adaptTextSchema,
};
