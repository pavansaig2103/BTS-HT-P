const { z } = require('zod');

// New simpler schema matching the requested strict shape:
// {
//   documentTitle: string,
//   summary: string,
//   steps: [{ stepOrder, title, officialInstruction, simplifiedExplanation, requiredDocuments: [string] }],
//   requirements: [{ title, isSatisfied }]
// }

const stepSchema = z.object({
  stepOrder: z.number().int().positive(),
  title: z.string().min(1),
  officialInstruction: z.string().min(1),
  simplifiedExplanation: z.string().min(1),
  requiredDocuments: z.array(z.string()).optional().default([]),
});

const requirementSchema = z.object({
  title: z.string().min(1),
  isSatisfied: z.boolean(),
});

const formIntelligenceSchema = z.object({
  documentTitle: z.string().min(1),
  summary: z.string().min(1),
  steps: z.array(stepSchema).min(0).default([]),
  requirements: z.array(requirementSchema).min(0).default([]),
});

module.exports = {
  formIntelligenceSchema,
  stepSchema,
  requirementSchema,
};
