const express = require("express");
const router = express.Router();
const profilesController = require("../controllers/profiles.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { profileValidators } = require("../validators/profiles.validator");

// Todas las rutas requieren autenticación
router.use(authenticate);

// Perfil del usuario actual
router.get("/me", profilesController.getMyProfile);
router.put(
  "/me",
  validate(profileValidators.updateMe),
  profilesController.updateMyProfile
);

// Buscar usuarios
router.get(
  "/search",
  validate(profileValidators.search),
  profilesController.searchProfiles
);

// Perfil de otro usuario
router.get(
  "/:id",
  validate(profileValidators.getById),
  profilesController.getProfileById
);

module.exports = router;
