const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflow.controller');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const {
  getWorkflowSchema,
  updateStepSchema,
  updateRequirementSchema,
} = require('../validators/workflow.validator');

router.use(authenticate);

router.get('/', workflowController.getUserWorkflows);
router.get('/:id', validate(getWorkflowSchema), workflowController.getWorkflow);
router.get('/:id/progress', validate(getWorkflowSchema), workflowController.getWorkflowProgress);
router.get('/:id/checklist', validate(getWorkflowSchema), workflowController.getWorkflowChecklist);
router.patch('/:workflowId/steps/:stepId', validate(updateStepSchema), workflowController.updateStep);
router.patch(
  '/:workflowId/requirements/:requirementId',
  validate(updateRequirementSchema),
  workflowController.updateRequirement
);

module.exports = router;
