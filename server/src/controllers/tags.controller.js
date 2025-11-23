const { supabase } = require("../config/supabase");

/**
 * Verificar acceso a una lista
 */
const checkListAccess = async (listId, userId, requiredRole = null) => {
  const { data: member, error } = await supabase
    .from("list_members")
    .select("role")
    .eq("list_id", listId)
    .eq("user_id", userId)
    .single();

  if (error || !member) {
    return { hasAccess: false, role: null };
  }

  if (requiredRole) {
    const roleHierarchy = { viewer: 0, editor: 1, owner: 2 };
    const userRoleLevel = roleHierarchy[member.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return { hasAccess: false, role: member.role };
    }
  }

  return { hasAccess: true, role: member.role };
};

/**
 * Obtener todas las etiquetas de una lista
 * GET /api/lists/:listId/tags
 */
const getTags = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId } = req.params;

    // Verificar acceso a la lista
    const { hasAccess } = await checkListAccess(listId, userId);
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    const { data: tags, error } = await supabase
      .from("list_tags")
      .select("*")
      .eq("list_id", listId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una etiqueta por ID
 * GET /api/lists/:listId/tags/:id
 */
const getTagById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId, id } = req.params;

    // Verificar acceso a la lista
    const { hasAccess } = await checkListAccess(listId, userId);
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    const { data: tag, error } = await supabase
      .from("list_tags")
      .select("*")
      .eq("id", id)
      .eq("list_id", listId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Etiqueta no encontrada",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva etiqueta
 * POST /api/lists/:listId/tags
 */
const createTag = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId } = req.params;
    const { name, color = "#3B82F6" } = req.body;

    // Verificar acceso a la lista (al menos editor)
    const { hasAccess } = await checkListAccess(listId, userId, "editor");
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    const { data: tag, error } = await supabase
      .from("list_tags")
      .insert({
        list_id: listId,
        name,
        color,
      })
      .select()
      .single();

    if (error) {
      // Error de duplicado (constraint list_tags_list_id_name_key)
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Ya existe una etiqueta con ese nombre en esta lista",
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Etiqueta creada exitosamente",
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una etiqueta
 * PUT /api/lists/:listId/tags/:id
 */
const updateTag = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId, id } = req.params;
    const { name, color } = req.body;

    // Verificar acceso a la lista (al menos editor)
    const { hasAccess } = await checkListAccess(listId, userId, "editor");
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (color !== undefined) updateData.color = color;

    const { data: tag, error } = await supabase
      .from("list_tags")
      .update(updateData)
      .eq("id", id)
      .eq("list_id", listId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Etiqueta no encontrada",
        });
      }
      // Error de duplicado
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "Ya existe una etiqueta con ese nombre en esta lista",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Etiqueta actualizada exitosamente",
      data: tag,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una etiqueta
 * DELETE /api/lists/:listId/tags/:id
 */
const deleteTag = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId, id } = req.params;

    // Verificar acceso a la lista (al menos editor)
    const { hasAccess } = await checkListAccess(listId, userId, "editor");
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    // Eliminar etiqueta (cascade eliminará task_tags)
    const { error } = await supabase
      .from("list_tags")
      .delete()
      .eq("id", id)
      .eq("list_id", listId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Etiqueta eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener tareas con una etiqueta específica
 * GET /api/lists/:listId/tags/:id/tasks
 */
const getTasksByTag = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId, id } = req.params;

    // Verificar acceso a la lista
    const { hasAccess } = await checkListAccess(listId, userId);
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    // Verificar que la etiqueta pertenece a la lista
    const { data: tag, error: tagError } = await supabase
      .from("list_tags")
      .select("id")
      .eq("id", id)
      .eq("list_id", listId)
      .single();

    if (tagError || !tag) {
      return res.status(404).json({
        success: false,
        message: "Etiqueta no encontrada",
      });
    }

    // Obtener tareas con esta etiqueta de la lista específica
    const { data: taskTags, error } = await supabase
      .from("task_tags")
      .select(
        `
        tasks!inner(
          *,
          task_assignees(profiles(id, email, first_name, last_name, avatar_url)),
          task_tags(list_tags(id, name, color)),
          todo_lists(id, title)
        )
      `
      )
      .eq("tag_id", id)
      .eq("tasks.list_id", listId);

    if (error) throw error;

    // Formatear tareas
    const tasks = (taskTags || [])
      .filter((item) => item.tasks)
      .map((item) => {
        const task = item.tasks;
        return {
          ...task,
          tags: task.task_tags?.map((tt) => tt.list_tags).filter(Boolean) || [],
          assignees:
            task.task_assignees?.map((ta) => ta.profiles).filter(Boolean) || [],
          list: task.todo_lists,
          task_tags: undefined,
          task_assignees: undefined,
          todo_lists: undefined,
        };
      });

    res.json({
      success: true,
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTags,
  getTagById,
  createTag,
  updateTag,
  deleteTag,
  getTasksByTag,
};
