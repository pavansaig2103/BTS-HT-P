// Document processing status
const DocumentStatus = {
  UPLOADED: 'uploaded',
  PROCESSING: 'processing',
  ANALYZING: 'analyzing',
  READY: 'ready',
  FAILED: 'failed',
};

// Workflow status
const WorkflowStatus = {
  ACTIVE: 'active',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

// Workflow step status
const StepStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  SKIPPED: 'skipped',
};

// Workflow readiness
const ReadinessStatus = {
  READY_FOR_FINAL_REVIEW: 'READY_FOR_FINAL_REVIEW',
  NOT_READY: 'NOT_READY',
};

// AI confidence levels
const ConfidenceLevel = {
  CONFIRMED: 'confirmed',
  UNCERTAIN: 'uncertain',
};

// Requirement types
const RequirementType = {
  DOCUMENT: 'document',
  ACTION: 'action',
  ELIGIBILITY: 'eligibility',
  INFORMATION: 'information',
};

// Requirement status
const RequirementStatus = {
  PENDING: 'pending',
  SATISFIED: 'satisfied',
  MISSING: 'missing',
};

// Accessibility preferences
const PreferredLanguage = {
  EN: 'en',
  TE: 'te',
};

const ExplanationLevel = {
  SIMPLE: 'simple',
  DETAILED: 'detailed',
};

const GuidanceMode = {
  STEP_BY_STEP: 'step_by_step',
};

// Allowed MIME types for upload
const AllowedMimeTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
const AllowedExtensions = ['.pdf', '.png', '.jpeg', '.jpg'];
const MaxFileSizeBytes = 10 * 1024 * 1024; // 10MB

module.exports = {
  DocumentStatus,
  WorkflowStatus,
  StepStatus,
  ReadinessStatus,
  ConfidenceLevel,
  RequirementType,
  RequirementStatus,
  PreferredLanguage,
  ExplanationLevel,
  GuidanceMode,
  AllowedMimeTypes,
  AllowedExtensions,
  MaxFileSizeBytes,
};
