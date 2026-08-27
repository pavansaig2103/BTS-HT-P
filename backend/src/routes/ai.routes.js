const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { askAiSchema, adaptTextSchema } = require('../validators/ai.validator');
const { aiLimiter } = require('../middleware/rateLimit.middleware');

router.use(authenticate);

router.post('/ask', aiLimiter, validate(askAiSchema), aiController.askAi);
router.post('/adapt', aiLimiter, validate(adaptTextSchema), aiController.adaptText);

module.exports = router;
