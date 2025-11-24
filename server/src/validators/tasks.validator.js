const { body, param, query } = require("express-validator");

const taskValidators = {
  getByList: [
    param("listId").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    query("parent_id").optional(),
    query("include_completed")
      .optional()
      .isIn(["true", "false"])
      .withMessage("include_completed debe ser true o false"),
  ],

  create: [
    param("listId").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    body("title")
      .trim()
      .notEmpty()
      .withMessage("El título es requerido")
      .isLength({ max: 500 })
      .withMessage("El título no puede exceder 500 caracteres"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage("La descripción no puede exceder 5000 caracteres"),
    body("parent_id")
      .optional()
      .isInt({ min: 1 })
      .withMessage("parent_id debe ser un número entero válido"),
    body("assignees")
      .optional()
      .isArray()
      .withMessage("assignees debe ser un array"),
    body("assignees.*")
      .optional()
      .isUUID()
      .withMessage("Cada assignee debe ser un UUID válido"),
    body("due_date")
      .optional()
      .isISO8601()
      .withMessage("due_date debe ser una fecha válida"),
    body("is_all_day")
      .optional()
      .isBoolean()
      .withMessage("is_all_day debe ser booleano"),
    body("tags").optional().isArray().withMessage("tags debe ser un array"),
    body("tags.*")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Cada tag debe ser un ID válido"),
  ],

  update: [
    param("id").isInt({ min: 1 }).withMessage("ID de tarea inválido"),
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("El título no puede estar vacío")
      .isLength({ max: 500 })
      .withMessage("El título no puede exceder 500 caracteres"),
    body("description")
      .optional()
      .trim()
      .isLength({ max: 5000 })
      .withMessage("La descripción no puede exceder 5000 caracteres"),
    body("is_completed")
      .optional()
      .isBoolean()
      .withMessage("is_completed debe ser booleano"),
    body("due_date")
      .optional()
      .custom(
        (value) =>
          value === null || new Date(value).toString() !== "Invalid Date"
      )
      .withMessage("due_date debe ser una fecha válida o null"),
    body("is_all_day")
      .optional()
      .isBoolean()
      .withMessage("is_all_day debe ser booleano"),
    body("assignees")
      .optional()
      .isArray()
      .withMessage("assignees debe ser un array"),
    body("assignees.*")
      .optional()
      .isUUID()
      .withMessage("Cada assignee debe ser un UUID válido"),
    body("tags").optional().isArray().withMessage("tags debe ser un array"),
    body("tags.*")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Cada tag debe ser un ID válido"),
  ],

  getById: [param("id").isInt({ min: 1 }).withMessage("ID de tarea inválido")],

  delete: [param("id").isInt({ min: 1 }).withMessage("ID de tarea inválido")],
};

module.exports = { taskValidators };
