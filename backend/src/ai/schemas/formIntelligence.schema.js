const { z } = require('zod');

const factItemSchema = z.object({
  value: z.string(),
  confidence: z.enum(['confirmed', 'uncertain']).default('confirmed'),
  sourceText: z.string().optional().default(''),
  status: z.enum(['confirmed', 'uncertain']).default('confirmed'),
});

const stepSchema = z.object({
  stepOrder: z.number().int().positive(),
  title: z.string().min(1),
  officialInstruction: z.string().min(1),
  simplifiedExplanation: z.string().min(1),
  isRequired: z.boolean().default(true),
  confidence: z.enum(['confirmed', 'uncertain']).default('confirmed'),
  sourceText: z.string().optional().default(''),
  suggestedFields: z.array(
    z.object({
      name: z.string(),
      label: z.string(),
      type: z.enum(['text', 'number', 'date', 'file', 'select', 'checkbox']).default('text'),
      required: z.boolean().default(true),
      placeholder: z.string().optional(),
    })
  ).optional().default([]),
});

const requirementSchema = z.object({
  requirementType: z.enum(['document', 'action', 'eligibility', 'information']).default('document'),
  title: z.string().min(1),
  description: z.string().min(1),
  isRequired: z.boolean().default(true),
  confidence: z.enum(['confirmed', 'uncertain']).default('confirmed'),
  sourceText: z.string().optional().default(''),
  stepOrderRef: z.number().int().positive().optional(),
});

const difficultTermSchema = z.object({
  term: z.string().min(1),
  simpleExplanation: z.string().min(1),
  teluguExplanation: z.string().optional().default(''),
});

const deadlineSchema = z.object({
  title: z.string(),
  value: z.string(),
  confidence: z.enum(['confirmed', 'uncertain']).default('confirmed'),
  sourceText: z.string().optional().default(''),
});

const formIntelligenceSchema = z.object({
  documentTitle: z.string().min(1),
  documentType: z.string().min(1),
  summary: z.string().min(1),
  sections: z.array(z.string()).optional().default([]),
  steps: z.array(stepSchema).min(1),
  requirements: z.array(requirementSchema).optional().default([]),
  difficultTerms: z.array(difficultTermSchema).optional().default([]),
  warnings: z.array(z.string()).optional().default([]),
  deadlines: z.array(deadlineSchema).optional().default([]),
  overallConfidence: z.enum(['confirmed', 'uncertain']).default('confirmed'),
  uncertaintyNotes: z.string().optional().default(''),
});

module.exports = {
  formIntelligenceSchema,
  stepSchema,
  requirementSchema,
  difficultTermSchema,
  deadlineSchema,
  factItemSchema,
};
