const { supabase } = require("../config/supabase");

/**
 * Verificar permisos de acceso a una lista
 * Optimizado para usar una sola consulta con join
 */
const checkListAccess = async (listId, userId, requiredRole = null) => {
  const { data: member, error } = await supabase
    .from("list_members")
    .select("role, todo_lists!inner(configuration)")
    .eq("list_id", listId)
    .eq("user_id", userId)
    .single();

  if (error || !member) {
    return { hasAccess: false, role: null, config: null };
  }

  if (requiredRole) {
    const roleHierarchy = { viewer: 0, editor: 1, owner: 2 };
    const userRoleLevel = roleHierarchy[member.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return {
        hasAccess: false,
        role: member.role,
        config: member.todo_lists?.configuration || null,
      };
    }
  }

  return {
    hasAccess: true,
    role: member.role,
    config: member.todo_lists?.configuration || null,
  };
};

/**
 * Formatear tarea con sus relaciones
 */
const formatTask = (task) => ({
  ...task,
  tags: task.task_tags?.map((tt) => tt.list_tags).filter(Boolean) || [],
  classroom_integration:
    task.classroom_integrations && task.classroom_integrations.length > 0
      ? task.classroom_integrations[0]
      : null,
  assignees:
    task.task_assignees?.map((ta) => ta.profiles).filter(Boolean) || [],
  list: task.todo_lists || undefined,
  task_tags: undefined,
  task_assignees: undefined,
  classroom_integrations: undefined,
  todo_lists: undefined,
});

/**
 * Obtener todas las tareas de una lista
 * GET /api/lists/:listId/tasks
 */
const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId } = req.params;
    const { parent_id = null, include_completed = true } = req.query;

    // Verificar acceso a la lista en una sola consulta
    const { hasAccess } = await checkListAccess(listId, userId);
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    // Construir query con todos los joins necesarios en una sola consulta
    let query = supabase
      .from("tasks")
      .select(
        `
        *,
        task_assignees(profiles(id, email, first_name, last_name, avatar_url)),
        task_tags(list_tags(id, name, color)),
        classroom_integrations(course_id, course_work_id, alternate_link, last_synced_at)
      `
      )
      .eq("list_id", listId);

    // Filtrar por parent_id
    if (parent_id === "null" || parent_id === null) {
      query = query.is("parent_id", null);
    } else if (parent_id) {
      query = query.eq("parent_id", parent_id);
    }

    // Filtrar completadas
    if (include_completed === "false") {
      query = query.eq("is_completed", false);
    }

    // Ordenar por fecha de creación
    query = query.order("created_at");

    const { data: tasks, error } = await query;

    if (error) throw error;

    // Formatear datos usando la función helper
    const formattedTasks = (tasks || []).map(formatTask);

    res.json({
      success: true,
      data: formattedTasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una tarea por ID
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Una sola consulta con join para verificar acceso y obtener datos
    const { data: task, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        task_assignees(profiles(id, email, first_name, last_name, avatar_url)),
        task_tags(list_tags(id, name, color)),
        classroom_integrations(course_id, course_work_id, alternate_link, last_synced_at),
        todo_lists!inner(id, title, list_members!inner(user_id, role))
      `
      )
      .eq("id", id)
      .eq("todo_lists.list_members.user_id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Tarea no encontrada",
        });
      }
      throw error;
    }

    // Formatear datos usando la función helper
    const formattedTask = formatTask(task);

    res.json({
      success: true,
      data: formattedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva tarea
 * POST /api/lists/:listId/tasks
 */
const createTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { listId } = req.params;
    const {
      title,
      description,
      parent_id,
      assignees = [],
      due_date,
      is_all_day = false,
      tags = [],
    } = req.body;

    // Verificar acceso (al menos editor)
    const { hasAccess } = await checkListAccess(listId, userId, "editor");
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    // Crear tarea
    const { data: task, error } = await supabase
      .from("tasks")
      .insert({
        list_id: listId,
        parent_id: parent_id || null,
        title,
        description: description || null,
        due_date: due_date || null,
        is_all_day,
        created_by: userId,
      })
      .select()
      .single();

    if (error) throw error;

    // Agregar assignees si se proporcionaron
    if (assignees && assignees.length > 0) {
      const assigneeInserts = assignees.map((userId) => ({
        task_id: task.id,
        user_id: userId,
      }));

      const { error: assigneesError } = await supabase
        .from("task_assignees")
        .insert(assigneeInserts);

      if (assigneesError) throw assigneesError;
    }

    // Agregar tags si se proporcionaron
    if (tags && tags.length > 0) {
      const tagInserts = tags.map((tagId) => ({
        task_id: task.id,
        tag_id: tagId,
      }));

      const { error: tagsError } = await supabase
        .from("task_tags")
        .insert(tagInserts);

      if (tagsError) throw tagsError;
    }

    // Obtener tarea completa con todas sus relaciones en una sola consulta
    const { data: fullTask } = await supabase
      .from("tasks")
      .select(
        `
        *,
        task_assignees(profiles(id, email, first_name, last_name, avatar_url)),
        task_tags(list_tags(id, name, color)),
        classroom_integrations(course_id, course_work_id, alternate_link, last_synced_at)
      `
      )
      .eq("id", task.id)
      .single();

    // Formatear usando la función helper
    const formattedTask = formatTask(fullTask);

    res.status(201).json({
      success: true,
      message: "Tarea creada exitosamente",
      data: formattedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una tarea
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      title,
      description,
      is_completed,
      due_date,
      is_all_day,
      assignees,
      tags,
    } = req.body;

    // Obtener tarea y verificar acceso en una sola consulta usando join
    const { data: existingTask, error: taskError } = await supabase
      .from("tasks")
      .select(
        `
        list_id,
        task_assignees(user_id),
        todo_lists!inner(
          id,
          configuration,
          list_members!inner(user_id, role)
        )
      `
      )
      .eq("id", id)
      .eq("todo_lists.list_members.user_id", userId)
      .single();

    if (taskError || !existingTask) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    const member = existingTask.todo_lists?.list_members?.[0];
    const config = existingTask.todo_lists?.configuration;

    // Verificar que tenga al menos rol de editor
    const roleHierarchy = { viewer: 0, editor: 1, owner: 2 };
    const userRoleLevel = roleHierarchy[member?.role] || 0;

    if (userRoleLevel < roleHierarchy.editor) {
      return res.status(403).json({
        success: false,
        message: "Sin permisos para editar esta tarea",
      });
    }

    // Si restrict_editing_to_assignee está activo y no es owner
    if (config?.restrict_editing_to_assignee && member?.role !== "owner") {
      // Verificar si el usuario actual está entre los assignees
      const isAssignee = existingTask.task_assignees?.some(
        (ta) => ta.user_id === userId
      );

      if (!isAssignee) {
        return res.status(403).json({
          success: false,
          message: "Solo los asignados pueden editar esta tarea",
        });
      }
    }

    // Preparar actualización
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (is_completed !== undefined) updateData.is_completed = is_completed;
    if (due_date !== undefined) updateData.due_date = due_date;
    if (is_all_day !== undefined) updateData.is_all_day = is_all_day;

    // Actualizar tarea
    const { data: task, error } = await supabase
      .from("tasks")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    // Actualizar assignees si se proporcionaron
    if (assignees !== undefined) {
      // Eliminar assignees existentes
      await supabase.from("task_assignees").delete().eq("task_id", id);

      // Agregar nuevos assignees
      if (assignees.length > 0) {
        const assigneeInserts = assignees.map((userId) => ({
          task_id: id,
          user_id: userId,
        }));

        await supabase.from("task_assignees").insert(assigneeInserts);
      }
    }

    // Actualizar tags si se proporcionaron
    if (tags !== undefined) {
      // Eliminar tags existentes
      await supabase.from("task_tags").delete().eq("task_id", id);

      // Agregar nuevos tags
      if (tags.length > 0) {
        const tagInserts = tags.map((tagId) => ({
          task_id: id,
          tag_id: tagId,
        }));

        await supabase.from("task_tags").insert(tagInserts);
      }
    }

    // Obtener tarea completa con todas sus relaciones
    const { data: fullTask } = await supabase
      .from("tasks")
      .select(
        `
        *,
        task_assignees(profiles(id, email, first_name, last_name, avatar_url)),
        task_tags(list_tags(id, name, color)),
        classroom_integrations(course_id, course_work_id, alternate_link, last_synced_at)
      `
      )
      .eq("id", id)
      .single();

    // Formatear usando la función helper
    const formattedTask = formatTask(fullTask);

    res.json({
      success: true,
      message: "Tarea actualizada exitosamente",
      data: formattedTask,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una tarea
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar que la tarea existe y el usuario tiene acceso en una sola consulta
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select(
        `
        list_id,
        todo_lists!inner(
          id,
          list_members!inner(user_id, role)
        )
      `
      )
      .eq("id", id)
      .eq("todo_lists.list_members.user_id", userId)
      .single();

    if (taskError || !task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    const member = task.todo_lists?.list_members?.[0];
    const roleHierarchy = { viewer: 0, editor: 1, owner: 2 };
    const userRoleLevel = roleHierarchy[member?.role] || 0;

    if (userRoleLevel < roleHierarchy.editor) {
      return res.status(403).json({
        success: false,
        message: "Sin permisos para eliminar esta tarea",
      });
    }

    // Eliminar tarea (cascade eliminará subtareas, tags, etc.)
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Tarea eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener subtareas de una tarea
 * GET /api/tasks/:id/subtasks
 */
const getSubtasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Obtener subtareas y verificar acceso en una sola consulta usando join
    const { data: subtasks, error } = await supabase
      .from("tasks")
      .select(
        `
        *,
        task_assignees(profiles(id, email, first_name, last_name, avatar_url)),
        task_tags(list_tags(id, name, color)),
        classroom_integrations(course_id, course_work_id, alternate_link, last_synced_at),
        todo_lists!inner(
          id,
          list_members!inner(user_id)
        )
      `
      )
      .eq("parent_id", id)
      .eq("todo_lists.list_members.user_id", userId)
      .order("created_at");

    if (error) throw error;

    // Formatear usando la función helper
    const formattedSubtasks = (subtasks || []).map(formatTask);

    res.json({
      success: true,
      data: formattedSubtasks,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las listas del usuario con sus tareas
 * GET /api/tasks
 *
 * VERSIÓN OPTIMIZADA: Usa función de PostgreSQL que devuelve:
 * - lists: Array de listas con sus tareas incluidas
 * - metadata: Información adicional de la consulta
 *
 * ENFOQUE: Listas primero, las tareas están dentro de cada lista
 * Así las listas vacías también se devuelven
 */
const getAllUserTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { include_completed = true, include_archived = false } = req.query;

    // Llamar a la función de PostgreSQL optimizada
    const { data, error } = await supabase.rpc("get_user_lists_with_tasks", {
      p_user_id: userId,
      p_include_completed:
        include_completed === "true" || include_completed === true,
      p_include_archived:
        include_archived === "true" || include_archived === true,
    });

    if (error) throw error;

    // La función devuelve: { lists: [...], metadata: {...} }
    // Cada lista tiene sus tareas en list.tasks
    res.json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getSubtasks,
  getAllUserTasks,
};
