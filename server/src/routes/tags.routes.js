const express = require("express");
const router = express.Router({ mergeParams: true }); // mergeParams para acceder a listId
const tagsController = require("../controllers/tags.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { tagValidators } = require("../validators/tags.validator");

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de etiquetas (anidadas bajo /lists/:listId/tags)
router.get("/", tagsController.getTags);
router.get("/:id", validate(tagValidators.getById), tagsController.getTagById);
router.post("/", validate(tagValidators.create), tagsController.createTag);
router.put("/:id", validate(tagValidators.update), tagsController.updateTag);
router.delete("/:id", validate(tagValidators.delete), tagsController.deleteTag);
router.get(
  "/:id/tasks",
  validate(tagValidators.getById),
  tagsController.getTasksByTag
);

module.exports = router;
