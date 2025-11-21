const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const {
  registerValidation,
  loginValidation,
  resetPasswordValidation,
  updatePasswordValidation,
} = require("../validators/auth.validator");

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post("/register", registerValidation, validate, authController.register);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post("/login", loginValidation, validate, authController.login);

/**
 * @route   POST /api/auth/oauth/:provider
 * @desc    Login con OAuth (Google, GitHub, etc)
 * @access  Public
 */
router.post("/oauth/:provider", authController.oauthLogin);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout de usuario
 * @access  Private
 */
router.post("/logout", verifyToken, authController.logout);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Solicitar reset de contraseña
 * @access  Public
 */
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  authController.resetPassword
);

/**
 * @route   PUT /api/auth/update-password
 * @desc    Actualizar contraseña
 * @access  Private
 */
router.put(
  "/update-password",
  verifyToken,
  updatePasswordValidation,
  validate,
  authController.updatePassword
);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario actual
 * @access  Private
 */
router.get("/me", verifyToken, authController.getCurrentUser);

module.exports = router;
