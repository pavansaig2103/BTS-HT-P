const { z } = require('zod');

const getDocumentSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid document ID format'),
  }),
});

module.exports = {
  getDocumentSchema,
};
