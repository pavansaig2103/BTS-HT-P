const { z } = require('zod');

const getWorkflowSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid workflow ID format'),
  }),
});

const updateStepSchema = z.object({
  params: z.object({
    workflowId: z.string().uuid('Invalid workflow ID format'),
    stepId: z.string().uuid('Invalid step ID format'),
  }),
  body: z.object({
    status: z.enum(['pending', 'in_progress', 'completed', 'skipped']).optional(),
    fieldPayload: z.record(z.any()).optional(),
  }),
});

const updateRequirementSchema = z.object({
  params: z.object({
    workflowId: z.string().uuid('Invalid workflow ID format'),
    requirementId: z.string().uuid('Invalid requirement ID format'),
  }),
  body: z.object({
    isSatisfied: z.boolean(),
  }),
});

module.exports = {
  getWorkflowSchema,
  updateStepSchema,
  updateRequirementSchema,
};
