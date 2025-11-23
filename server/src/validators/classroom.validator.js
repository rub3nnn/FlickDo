const { body, param } = require("express-validator");

const classroomValidators = {
  upsert: [
    param("taskId").isInt({ min: 1 }).withMessage("ID de tarea inválido"),
    body("course_id")
      .notEmpty()
      .withMessage("course_id es requerido")
      .trim()
      .isLength({ max: 255 })
      .withMessage("course_id no puede exceder 255 caracteres"),
    body("course_work_id")
      .notEmpty()
      .withMessage("course_work_id es requerido")
      .trim()
      .isLength({ max: 255 })
      .withMessage("course_work_id no puede exceder 255 caracteres"),
    body("alternate_link")
      .optional()
      .trim()
      .isURL()
      .withMessage("alternate_link debe ser una URL válida"),
  ],

  get: [param("taskId").isInt({ min: 1 }).withMessage("ID de tarea inválido")],

  delete: [
    param("taskId").isInt({ min: 1 }).withMessage("ID de tarea inválido"),
  ],

  updateSync: [
    param("taskId").isInt({ min: 1 }).withMessage("ID de tarea inválido"),
  ],
};

module.exports = { classroomValidators };
