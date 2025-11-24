const { supabase } = require("../config/supabase");

/**
 * Verificar acceso a una tarea
 */
const checkTaskAccess = async (taskId, userId) => {
  const { data: task, error } = await supabase
    .from("tasks")
    .select("list_id, todo_lists(id)")
    .eq("id", taskId)
    .single();

  if (error || !task) {
    return { hasAccess: false };
  }

  const { data: member } = await supabase
    .from("list_members")
    .select("role")
    .eq("list_id", task.list_id)
    .eq("user_id", userId)
    .single();

  return { hasAccess: !!member, role: member?.role };
};

/**
 * Obtener integración de Classroom de una tarea
 * GET /api/tasks/:taskId/classroom
 */
const getClassroomIntegration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    // Verificar acceso a la tarea
    const { hasAccess } = await checkTaskAccess(taskId, userId);
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    const { data: integration, error } = await supabase
      .from("classroom_integrations")
      .select("*")
      .eq("task_id", taskId)
      .maybeSingle();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    res.json({
      success: true,
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear o actualizar integración de Classroom
 * PUT /api/tasks/:taskId/classroom
 */
const upsertClassroomIntegration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { course_id, course_work_id, alternate_link } = req.body;

    // Verificar acceso (al menos editor)
    const { hasAccess, role } = await checkTaskAccess(taskId, userId);
    if (!hasAccess || (role !== "owner" && role !== "editor")) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada o sin permisos",
      });
    }

    // Verificar que la tarea existe
    const { data: task, error: taskError } = await supabase
      .from("tasks")
      .select("id")
      .eq("id", taskId)
      .single();

    if (taskError || !task) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    // Upsert (insertar o actualizar)
    const { data: integration, error } = await supabase
      .from("classroom_integrations")
      .upsert(
        {
          task_id: taskId,
          course_id,
          course_work_id,
          alternate_link: alternate_link || null,
          last_synced_at: new Date().toISOString(),
        },
        {
          onConflict: "task_id",
        }
      )
      .select()
      .single();

    if (error) throw error;

    res.json({
      success: true,
      message: "Integración de Classroom guardada exitosamente",
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar integración de Classroom
 * DELETE /api/tasks/:taskId/classroom
 */
const deleteClassroomIntegration = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    // Verificar acceso (al menos editor)
    const { hasAccess, role } = await checkTaskAccess(taskId, userId);
    if (!hasAccess || (role !== "owner" && role !== "editor")) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada o sin permisos",
      });
    }

    const { error } = await supabase
      .from("classroom_integrations")
      .delete()
      .eq("task_id", taskId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Integración de Classroom eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar última sincronización
 * PATCH /api/tasks/:taskId/classroom/sync
 */
const updateLastSynced = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;

    // Verificar acceso
    const { hasAccess } = await checkTaskAccess(taskId, userId);
    if (!hasAccess) {
      return res.status(404).json({
        success: false,
        message: "Tarea no encontrada",
      });
    }

    const { data: integration, error } = await supabase
      .from("classroom_integrations")
      .update({ last_synced_at: new Date().toISOString() })
      .eq("task_id", taskId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Integración de Classroom no encontrada",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Sincronización actualizada",
      data: integration,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClassroomIntegration,
  upsertClassroomIntegration,
  deleteClassroomIntegration,
  updateLastSynced,
};
