const { body, param, query } = require("express-validator");

const profileValidators = {
  updateMe: [
    body("first_name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("El nombre no puede exceder 100 caracteres"),
    body("last_name")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("El apellido no puede exceder 100 caracteres"),
    body("avatar_url")
      .optional()
      .trim()
      .isURL()
      .withMessage("La URL del avatar debe ser válida"),
  ],

  getById: [
    param("id").isUUID().withMessage("ID de perfil debe ser un UUID válido"),
  ],

  search: [
    query("email")
      .notEmpty()
      .withMessage("El email es requerido")
      .isLength({ min: 3 })
      .withMessage("El email debe tener al menos 3 caracteres"),
  ],
};

module.exports = { profileValidators };
