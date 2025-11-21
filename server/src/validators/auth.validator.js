const { body } = require("express-validator");

/**
 * Validaciones para registro de usuario
 */
const registerValidation = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),

  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),
];

/**
 * Validaciones para login de usuario
 */
const loginValidation = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),

  body("password").notEmpty().withMessage("La contraseña es requerida"),
];

/**
 * Validaciones para reset de contraseña
 */
const resetPasswordValidation = [
  body("email").isEmail().withMessage("Email inválido").normalizeEmail(),
];

/**
 * Validaciones para actualizar contraseña
 */
const updatePasswordValidation = [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "La contraseña debe contener al menos una mayúscula, una minúscula y un número"
    ),
];

module.exports = {
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  updatePasswordValidation,
};
