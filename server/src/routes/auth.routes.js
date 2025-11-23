const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { authValidators } = require("../validators/auth.validator");

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public
 */
router.post(
  "/register",
  validate(authValidators.register),
  authController.register
);

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuario
 * @access  Public
 */
router.post("/login", validate(authValidators.login), authController.login);

/**
 * @route   POST /api/auth/oauth/:provider
 * @desc    Login con OAuth (Google, GitHub, etc)
 * @access  Public
 */
router.post("/oauth/:provider", authController.oauthLogin);

/**
 * @route   POST /api/auth/oauth-callback
 * @desc    Manejar callback de OAuth
 * @access  Public
 */
router.post("/oauth-callback", authController.handleOAuthCallback);

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
  validate(authValidators.resetPassword),
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
  validate(authValidators.updatePassword),
  authController.updatePassword
);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener usuario actual
 * @access  Private
 */
router.get("/me", verifyToken, authController.getCurrentUser);

/**
 * @route   POST /api/auth/verify-email
 * @desc    Verificar email del usuario
 * @access  Public
 */
router.post("/verify-email", authController.verifyEmail);

module.exports = router;
