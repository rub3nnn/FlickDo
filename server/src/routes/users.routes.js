const express = require("express");
const router = express.Router();
const {
  updateProfile,
  changePassword,
  deleteAccount,
} = require("../controllers/users.controller");
const {
  updateProfileValidator,
  changePasswordValidator,
  deleteAccountValidator,
} = require("../validators/users.validator");
const { authenticate } = require("../middleware/auth.middleware");

// Todas las rutas requieren autenticación
router.use(authenticate);

// Actualizar perfil
router.put("/profile", updateProfileValidator, updateProfile);

// Cambiar contraseña
router.put("/password", changePasswordValidator, changePassword);

// Eliminar cuenta
router.delete("/account", deleteAccountValidator, deleteAccount);

module.exports = router;
