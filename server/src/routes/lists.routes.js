const express = require("express");
const router = express.Router();
const listsController = require("../controllers/lists.controller");
const tasksController = require("../controllers/tasks.controller");
const tagsRoutes = require("./tags.routes");
const { authenticate } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { listValidators } = require("../validators/lists.validator");
const { taskValidators } = require("../validators/tasks.validator");

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas de listas
router.get("/", listsController.getLists);
router.get(
  "/:id",
  validate(listValidators.getById),
  listsController.getListById
);
router.post("/", validate(listValidators.create), listsController.createList);
router.put("/:id", validate(listValidators.update), listsController.updateList);
router.delete(
  "/:id",
  validate(listValidators.delete),
  listsController.deleteList
);

// Rutas de miembros de lista
router.get(
  "/:id/members",
  validate(listValidators.getById),
  listsController.getListMembers
);
router.post(
  "/:id/members",
  validate(listValidators.addMember),
  listsController.addListMember
);
router.put(
  "/:id/members/:userId",
  validate(listValidators.updateMember),
  listsController.updateListMember
);
router.delete(
  "/:id/members/:userId",
  validate(listValidators.removeMember),
  listsController.removeListMember
);

// Rutas de tareas de una lista
router.get(
  "/:listId/tasks",
  validate(taskValidators.getByList),
  tasksController.getTasks
);
router.post(
  "/:listId/tasks",
  validate(taskValidators.create),
  tasksController.createTask
);

// Rutas de etiquetas de una lista (anidadas bajo /lists/:listId/tags)
router.use("/:listId/tags", tagsRoutes);

module.exports = router;
