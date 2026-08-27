const multer = require('multer');
const path = require('path');
const AppError = require('../utils/AppError');
const { AllowedMimeTypes, AllowedExtensions, MaxFileSizeBytes } = require('../constants/enums');

// Store file in memory buffer for validation, extraction, and Supabase private upload
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  const isMimeAllowed = AllowedMimeTypes.includes(file.mimetype);
  const isExtAllowed = AllowedExtensions.includes(ext);

  if (isMimeAllowed && isExtAllowed) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        `Invalid file type (${file.mimetype}). Only PDF, PNG, and JPEG files up to 10MB are permitted.`,
        400,
        'INVALID_FILE_TYPE'
      ),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: MaxFileSizeBytes,
  },
  fileFilter,
});

module.exports = { upload };
