const AppError = require('../utils/AppError');

const validate = (schema) => (req, res, next) => {
  try {
    const validated = schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (validated.body) req.body = validated.body;
    if (validated.query) req.query = validated.query;
    if (validated.params) req.params = validated.params;

    next();
  } catch (err) {
    if (err.errors) {
      const details = err.errors.map((e) => ({
        path: e.path.join('.').replace(/^(body|query|params)\./, ''),
        message: e.message,
      }));
      return next(new AppError('Validation failed', 400, 'VALIDATION_ERROR', details));
    }
    next(err);
  }
};

module.exports = validate;
