const { body, param } = require("express-validator");

const tagValidators = {
  create: [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("El nombre es requerido")
      .isLength({ max: 100 })
      .withMessage("El nombre no puede exceder 100 caracteres"),
    body("color")
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage("El color debe estar en formato hexadecimal (#RRGGBB)"),
    param("listId").isInt({ min: 1 }).withMessage("ID de lista inválido"),
  ],

  update: [
    param("listId").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    param("id").isInt({ min: 1 }).withMessage("ID de etiqueta inválido"),
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("El nombre no puede estar vacío")
      .isLength({ max: 100 })
      .withMessage("El nombre no puede exceder 100 caracteres"),
    body("color")
      .optional()
      .matches(/^#[0-9A-Fa-f]{6}$/)
      .withMessage("El color debe estar en formato hexadecimal (#RRGGBB)"),
  ],

  getById: [
    param("listId").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    param("id").isInt({ min: 1 }).withMessage("ID de etiqueta inválido"),
  ],

  delete: [
    param("listId").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    param("id").isInt({ min: 1 }).withMessage("ID de etiqueta inválido"),
  ],
};

module.exports = { tagValidators };
