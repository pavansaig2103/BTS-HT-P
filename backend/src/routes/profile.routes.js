const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profile.controller');
const validate = require('../middleware/validate.middleware');
const { updateProfileSchema } = require('../validators/profile.validator');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/', profileController.getProfile);
router.patch('/', validate(updateProfileSchema), profileController.updateProfile);

module.exports = router;
