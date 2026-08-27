const formIntelligenceService = require('./formIntelligence.service');
const accessibilityAdaptationService = require('./accessibilityAdaptation.service');
const contextualAssistanceService = require('./contextualAssistance.service');

class AIOrchestrationService {
  /**
   * Orchestrates complete document understanding pipeline
   */
  async processDocumentIntelligence(extractedText, filename) {
    return await formIntelligenceService.analyzeDocument(extractedText, filename);
  }

  /**
   * Adapts text to user accessibility profile
   */
  async adaptText(options) {
    return await accessibilityAdaptationService.adaptText(options);
  }

  /**
   * Provides contextual assistance for workflow & document questions
   */
  async askContextualAssistant(context) {
    return await contextualAssistanceService.answerQuestion(context);
  }
}

module.exports = new AIOrchestrationService();
