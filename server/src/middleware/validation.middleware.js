const { validationResult } = require("express-validator");

/**
 * Middleware para validar los resultados de express-validator
 * @param {Array} validations - Array de validaciones de express-validator
 * @returns {Function} Middleware de Express
 */
const validate = (validations) => {
  return async (req, res, next) => {
    // Ejecutar todas las validaciones
    if (Array.isArray(validations)) {
      for (let validation of validations) {
        const result = await validation.run(req);
      }
    }

    // Verificar si hay errores
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Errores de validación",
        errors: errors.array().map((err) => ({
          field: err.path,
          message: err.msg,
        })),
      });
    }

    next();
  };
};

module.exports = { validate };
