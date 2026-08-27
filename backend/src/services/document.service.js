const { v4: uuidv4 } = require('uuid');
const { supabase } = require('../config/supabase');
const env = require('../config/env');
const textExtractionService = require('./textExtraction.service');
const aiOrchestrationService = require('./ai/aiOrchestration.service');
const workflowService = require('./workflow.service');
const AppError = require('../utils/AppError');
const { DocumentStatus } = require('../constants/enums');

class DocumentService {
  /**
   * Complete end-to-end document processing pipeline
   */
  async processDocumentUpload({ userId, file }) {
    const documentId = uuidv4();
    const storagePath = `user_${userId}/${documentId}_${file.originalname}`;

    // 1. Upload to Supabase Private Storage Bucket
    const { error: storageError } = await supabase.storage
      .from(env.SUPABASE_STORAGE_BUCKET)
      .upload(storagePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (storageError) {
      console.warn('⚠️ Storage upload note:', storageError.message);
    }

    // 2. Create Initial Document Record (status: uploaded)
    const { data: doc, error: insertError } = await supabase
      .from('documents')
      .insert({
        id: documentId,
        user_id: userId,
        original_filename: file.originalname,
        storage_path: storagePath,
        mime_type: file.mimetype,
        file_size: file.size,
        status: DocumentStatus.UPLOADED,
      })
      .select()
      .single();

    if (insertError || !doc) {
      throw new AppError(`Failed to create document record: ${insertError?.message || 'DB Error'}`, 500, 'DB_ERROR');
    }

    try {
      // 3. Update status -> processing & Extract Text
      await supabase
        .from('documents')
        .update({ status: DocumentStatus.PROCESSING })
        .eq('id', documentId);

      let extractionResult;
      try {
        extractionResult = await textExtractionService.extractText(file.buffer, file.mimetype, file.originalname);
      } catch (extractionErr) {
        console.warn('⚠️ Text extraction failed, proceeding with fallback analysis:', extractionErr.message);
        // Use empty text for fallback analysis
        extractionResult = { text: '', status: DocumentStatus.READY };
      }

      // 4. Update status -> analyzing & save raw text (may be empty)
      await supabase
        .from('documents')
        .update({
          status: DocumentStatus.ANALYZING,
          raw_extracted_text: extractionResult.text,
        })
        .eq('id', documentId);

      // 5. Run Form Intelligence (AI Analysis + Strict Zod Validation)
      const aiAnalysis = await aiOrchestrationService.processDocumentIntelligence(
        extractionResult.text,
        file.originalname
      );

      // 6. Persist Trusted Analysis & Update document record
      await supabase
        .from('documents')
        .update({
          document_title: aiAnalysis.documentTitle,
          document_type: aiAnalysis.documentType,
          ai_analysis: aiAnalysis,
          ai_analysis_confidence: aiAnalysis.overallConfidence || 'confirmed',
          status: DocumentStatus.READY,
        })
        .eq('id', documentId);

      // 7. Generate Deterministic Workflow
      const workflow = await workflowService.createWorkflowFromIntelligence({
        userId,
        documentId,
        analysisResult: aiAnalysis,
      });

      return {
        document: {
          id: documentId,
          documentTitle: aiAnalysis.documentTitle,
          documentType: aiAnalysis.documentType,
          status: DocumentStatus.READY,
          originalFilename: file.originalname,
          confidence: aiAnalysis.overallConfidence,
          warnings: aiAnalysis.warnings || [],
          deadlines: aiAnalysis.deadlines || [],
        },
        workflow,
      };
    } catch (pipelineError) {
      console.error('💥 Document pipeline error:', pipelineError);
      // Mark document as failed with safe message
      await supabase
        .from('documents')
        .update({
          status: DocumentStatus.FAILED,
          processing_error: pipelineError.message || 'Processing failed unexpectedly.',
        })
        .eq('id', documentId);

      throw new AppError(
        `Document processing failed: ${pipelineError.message}`,
        500,
        'DOCUMENT_PROCESSING_FAILED'
      );
    }
  }

  async getDocumentById(documentId, userId) {
    const { data: document, error } = await supabase
      .from('documents')
      .select('*')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (error || !document) {
      throw new AppError('Document not found or access denied.', 404, 'DOCUMENT_NOT_FOUND');
    }

    return document;
  }

  async getDocumentStatus(documentId, userId) {
    const { data: document, error } = await supabase
      .from('documents')
      .select('id, status, document_title, document_type, processing_error, created_at, updated_at')
      .eq('id', documentId)
      .eq('user_id', userId)
      .single();

    if (error || !document) {
      throw new AppError('Document not found or access denied.', 404, 'DOCUMENT_NOT_FOUND');
    }

    return document;
  }

  async getUserDocuments(userId) {
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, document_title, document_type, original_filename, status, file_size, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new AppError(`Failed to fetch documents: ${error.message}`, 500, 'DB_ERROR');
    }

    return documents || [];
  }
}

module.exports = new DocumentService();
