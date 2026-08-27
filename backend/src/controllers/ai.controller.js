const aiOrchestrationService = require('../services/ai/aiOrchestration.service');
const profileService = require('../services/profile.service');
const workflowService = require('../services/workflow.service');
const { supabase } = require('../config/supabase');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

const askAi = asyncHandler(async (req, res) => {
  const { workflowId, stepId, question } = req.body;
  const userId = req.user.id;

  // 1. Fetch user accessibility profile server-side
  const profile = await profileService.getProfile(userId);

  // 2. Fetch workflow and step context if provided
  let workflow = null;
  let currentStep = null;
  let documentText = '';
  let documentTitle = '';
  let documentType = '';

  if (workflowId) {
    try {
      workflow = await workflowService.getWorkflowById(workflowId, userId);
      documentTitle = workflow.document?.document_title || workflow.title;
      documentType = workflow.document?.document_type || 'Application Scheme';
      documentText = workflow.document?.raw_extracted_text || '';

      if (stepId && workflow.steps) {
        currentStep = workflow.steps.find((s) => s.id === stepId) || null;
      }
    } catch (e) {
      console.warn('⚠️ Could not load full workflow context for AI query:', e.message);
    }
  }

  // 3. Ask Contextual AI
  const answerResult = await aiOrchestrationService.askContextualAssistant({
    question,
    documentTitle,
    documentType,
    documentText,
    stepTitle: currentStep?.title || '',
    stepOfficialInstruction: currentStep?.official_instruction || '',
    stepSimplifiedExplanation: currentStep?.simplified_explanation || '',
    stepFields: currentStep?.field_payload || {},
    language: profile.preferred_language || 'en',
    explanationLevel: profile.explanation_level || 'simple',
  });

  // 4. Persist Interaction to ai_interactions table
  await supabase.from('ai_interactions').insert({
    id: uuidv4(),
    user_id: userId,
    workflow_id: workflowId || null,
    step_id: stepId || null,
    question,
    answer: answerResult.answer,
    grounded: answerResult.grounded !== undefined ? answerResult.grounded : true,
    confidence: answerResult.confidence || 'confirmed',
  });

  return successResponse(res, answerResult, 200);
});

const adaptText = asyncHandler(async (req, res) => {
  const { text, language, explanationLevel } = req.body;

  const result = await aiOrchestrationService.adaptText({
    officialText: text,
    language: language || 'en',
    explanationLevel: explanationLevel || 'simple',
  });

  return successResponse(res, result, 200);
});

module.exports = {
  askAi,
  adaptText,
};
