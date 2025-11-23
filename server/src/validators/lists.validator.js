const { body, param, query } = require("express-validator");

const listValidators = {
  create: [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("El título es requerido")
      .isLength({ max: 255 })
      .withMessage("El título no puede exceder 255 caracteres"),
    body("configuration")
      .optional()
      .isObject()
      .withMessage("La configuración debe ser un objeto"),
    body("configuration.type")
      .optional()
      .isIn(["standard"])
      .withMessage("Tipo de configuración inválido"),
    body("configuration.show_dates")
      .optional()
      .isBoolean()
      .withMessage("show_dates debe ser booleano"),
    body("configuration.enable_assignments")
      .optional()
      .isBoolean()
      .withMessage("enable_assignments debe ser booleano"),
    body("configuration.restrict_editing_to_assignee")
      .optional()
      .isBoolean()
      .withMessage("restrict_editing_to_assignee debe ser booleano"),
  ],

  update: [
    param("id").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    body("title")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("El título no puede estar vacío")
      .isLength({ max: 255 })
      .withMessage("El título no puede exceder 255 caracteres"),
    body("configuration")
      .optional()
      .isObject()
      .withMessage("La configuración debe ser un objeto"),
    body("is_archived")
      .optional()
      .isBoolean()
      .withMessage("is_archived debe ser booleano"),
  ],

  getById: [param("id").isInt({ min: 1 }).withMessage("ID de lista inválido")],

  delete: [param("id").isInt({ min: 1 }).withMessage("ID de lista inválido")],

  addMember: [
    param("id").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    body("user_id")
      .notEmpty()
      .withMessage("user_id es requerido")
      .isUUID()
      .withMessage("user_id debe ser un UUID válido"),
    body("role")
      .optional()
      .isIn(["owner", "editor", "viewer"])
      .withMessage("Rol inválido. Debe ser owner, editor o viewer"),
  ],

  updateMember: [
    param("id").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    param("userId").isUUID().withMessage("user_id debe ser un UUID válido"),
    body("role")
      .notEmpty()
      .withMessage("El rol es requerido")
      .isIn(["owner", "editor", "viewer"])
      .withMessage("Rol inválido. Debe ser owner, editor o viewer"),
  ],

  removeMember: [
    param("id").isInt({ min: 1 }).withMessage("ID de lista inválido"),
    param("userId").isUUID().withMessage("user_id debe ser un UUID válido"),
  ],
};

module.exports = { listValidators };
