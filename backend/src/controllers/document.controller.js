const documentService = require('../services/document.service');
const asyncHandler = require('../utils/asyncHandler');
const { successResponse } = require('../utils/response');
const AppError = require('../utils/AppError');

const uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No document file uploaded. Please select a PDF, PNG, or JPEG file.', 400, 'NO_FILE_UPLOADED');
  }

  const result = await documentService.processDocumentUpload({
    userId: req.user.id,
    file: req.file,
  });

  return successResponse(res, result, 201);
});

const getDocument = asyncHandler(async (req, res) => {
  const document = await documentService.getDocumentById(req.params.id, req.user.id);
  return successResponse(res, { document }, 200);
});

const getDocumentStatus = asyncHandler(async (req, res) => {
  const status = await documentService.getDocumentStatus(req.params.id, req.user.id);
  return successResponse(res, { status }, 200);
});

const getUserDocuments = asyncHandler(async (req, res) => {
  const documents = await documentService.getUserDocuments(req.user.id);
  return successResponse(res, { documents }, 200);
});

module.exports = {
  uploadDocument,
  getDocument,
  getDocumentStatus,
  getUserDocuments,
};
