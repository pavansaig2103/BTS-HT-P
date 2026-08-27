const pdfParse = require('pdf-parse');
const AppError = require('../../utils/AppError');
const { DocumentStatus } = require('../../constants/enums');

class TextExtractionService {
  /**
   * Extract raw text from an uploaded file buffer.
   * Supports PDF files using pdf-parse. For other mime types, throws an error.
   * @param {Buffer} buffer - File buffer.
   * @param {string} mimetype - MIME type of the file.
   * @param {string} filename - Original filename (used for logging).
   * @returns {Promise<{text:string, status:string}>}
   */
  async extractText(buffer, mimetype, filename) {
    try {
      if (mimetype === 'application/pdf') {
        const data = await pdfParse(buffer);
        const cleanText = data.text ? data.text.trim() : '';
        return { text: cleanText, status: DocumentStatus.READY };
      }
      // Future: add OCR for images here.
      throw new AppError(`Unsupported file type for extraction: ${mimetype}`, 400, 'UNSUPPORTED_EXTRACT_TYPE');
    } catch (err) {
      console.error('💥 Text extraction failed for', filename, ':', err);
      // Wrap any error as a standardized AppError for upstream handling
      if (err instanceof AppError) {
        throw err;
      }
      throw new AppError(`Failed to extract text from document: ${err.message}`, 500, 'UPLOAD_EXTRACTION_FAILED');
    }
  }
}

module.exports = new TextExtractionService();
