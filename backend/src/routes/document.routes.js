const express = require('express');
const router = express.Router();
const documentController = require('../controllers/document.controller');
const { upload } = require('../middleware/upload.middleware');
const { authenticate } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { getDocumentSchema } = require('../validators/document.validator');

router.use(authenticate);

router.post('/upload', upload.single('file'), documentController.uploadDocument);
router.get('/', documentController.getUserDocuments);
router.get('/:id', validate(getDocumentSchema), documentController.getDocument);
router.get('/:id/status', validate(getDocumentSchema), documentController.getDocumentStatus);

module.exports = router;
