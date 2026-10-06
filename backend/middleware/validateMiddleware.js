export const validate = (schema) => (req, res, next) => {
  try {
    // Validate req.body against provided Zod schema
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error.errors) {
      // Map Zod error array into clear error messages
      const errorMessages = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      return res.status(400).json({
        message: 'Validation failed',
        errors: errorMessages,
      });
    }
    return res.status(400).json({ message: error.message });
  }
};  