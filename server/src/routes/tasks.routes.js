const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasks.controller");
const classroomController = require("../controllers/classroom.controller");
const { authenticate } = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validation.middleware");
const { taskValidators } = require("../validators/tasks.validator");
const { classroomValidators } = require("../validators/classroom.validator");

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener todas las tareas del usuario (de todas sus listas)
router.get("/", tasksController.getAllUserTasks);

// Rutas de tareas individuales
router.get(
  "/:id",
  validate(taskValidators.getById),
  tasksController.getTaskById
);
router.put("/:id", validate(taskValidators.update), tasksController.updateTask);
router.delete(
  "/:id",
  validate(taskValidators.delete),
  tasksController.deleteTask
);
router.get(
  "/:id/subtasks",
  validate(taskValidators.getById),
  tasksController.getSubtasks
);

// Rutas de integración con Google Classroom
router.get(
  "/:taskId/classroom",
  validate(classroomValidators.get),
  classroomController.getClassroomIntegration
);
router.put(
  "/:taskId/classroom",
  validate(classroomValidators.upsert),
  classroomController.upsertClassroomIntegration
);
router.delete(
  "/:taskId/classroom",
  validate(classroomValidators.delete),
  classroomController.deleteClassroomIntegration
);
router.patch(
  "/:taskId/classroom/sync",
  validate(classroomValidators.updateSync),
  classroomController.updateLastSynced
);

module.exports = router;
