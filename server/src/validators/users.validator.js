const { body, validationResult } = require("express-validator");

// Validar errores
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Errores de validación",
      errors: errors.array(),
    });
  }
  next();
};

// Validación para actualizar perfil
const updateProfileValidator = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),
  body("preferences")
    .optional()
    .isObject()
    .withMessage("Las preferencias deben ser un objeto válido"),
  validate,
];

// Validación para cambiar contraseña
const changePasswordValidator = [
  body("currentPassword")
    .notEmpty()
    .withMessage("La contraseña actual es requerida"),
  body("newPassword")
    .notEmpty()
    .withMessage("La nueva contraseña es requerida")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
  validate,
];

// Validación para eliminar cuenta
const deleteAccountValidator = [
  body("confirmationPhrase")
    .notEmpty()
    .withMessage("La frase de confirmación es requerida"),
  validate,
];

module.exports = {
  updateProfileValidator,
  changePasswordValidator,
  deleteAccountValidator,
};
