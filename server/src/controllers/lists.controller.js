const { supabase } = require("../config/supabase");

/**
 * Obtener todas las listas del usuario actual
 * GET /api/lists
 */
const getLists = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { include_archived = false, include_tasks = false } = req.query;

    // Si se solicitan las tareas, hacemos una consulta optimizada con join
    if (include_tasks === "true") {
      return getListsWithTasks(req, res, next);
    }

    // Obtener listas donde el usuario es owner o miembro
    const { data: ownedLists, error: ownedError } = await supabase
      .from("todo_lists")
      .select("*, list_members!inner(role)")
      .eq("owner_id", userId)
      .eq("is_archived", include_archived === "true");

    if (ownedError) throw ownedError;

    // Obtener listas compartidas (donde es miembro pero no owner)
    const { data: sharedLists, error: sharedError } = await supabase
      .from("list_members")
      .select("role, todo_lists!inner(*)")
      .eq("user_id", userId)
      .neq("todo_lists.owner_id", userId)
      .eq("todo_lists.is_archived", include_archived === "true");

    if (sharedError) throw sharedError;

    // Combinar y formatear resultados
    const formattedOwnedLists = ownedLists.map((list) => ({
      ...list,
      role: "owner",
    }));

    const formattedSharedLists = sharedLists.map((item) => ({
      ...item.todo_lists,
      role: item.role,
    }));

    const allLists = [...formattedOwnedLists, ...formattedSharedLists];

    res.json({
      success: true,
      data: allLists,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todas las listas del usuario con sus tareas
 * GET /api/lists?include_tasks=true
 */
const getListsWithTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { include_archived = false, include_completed = true } = req.query;

    // Obtener listas con sus tareas en UNA SOLA consulta optimizada
    const { data: lists, error: listsError } = await supabase
      .from("todo_lists")
      .select(
        `
        *,
        list_members!inner(user_id, role),
        tasks(
          *,
          task_assignees(profiles(id, email, first_name, last_name, avatar_url)),
          task_tags(tags(id, name, color)),
          classroom_integrations(course_id, course_work_id, alternate_link, last_synced_at)
        )
      `
      )
      .eq("list_members.user_id", userId)
      .eq("is_archived", include_archived === "true")
      .order("tasks(created_at)");

    if (listsError) throw listsError;

    // Formatear resultados
    const formattedLists = lists.map((list) => {
      // Filtrar tareas si es necesario
      let tasks = list.tasks || [];

      if (include_completed === "false") {
        tasks = tasks.filter((task) => !task.is_completed);
      }

      // Formatear tareas
      tasks = tasks.map((task) => ({
        ...task,
        tags: task.task_tags?.map((tt) => tt.tags).filter(Boolean) || [],
        assignees:
          task.task_assignees?.map((ta) => ta.profiles).filter(Boolean) || [],
        classroom_integration:
          task.classroom_integrations && task.classroom_integrations.length > 0
            ? task.classroom_integrations[0]
            : null,
        task_tags: undefined,
        task_assignees: undefined,
        classroom_integrations: undefined,
      }));

      return {
        id: list.id,
        title: list.title,
        owner_id: list.owner_id,
        configuration: list.configuration,
        is_archived: list.is_archived,
        created_at: list.created_at,
        updated_at: list.updated_at,
        role: list.list_members[0]?.role || "viewer",
        tasks,
        list_members: undefined,
      };
    });

    res.json({
      success: true,
      data: formattedLists,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener una lista por ID
 * GET /api/lists/:id
 */
const getListById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar que el usuario tenga acceso a la lista
    const { data: list, error } = await supabase
      .from("todo_lists")
      .select("*, list_members(user_id, role)")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Lista no encontrada",
        });
      }
      throw error;
    }

    // Verificar permisos
    const isOwner = list.owner_id === userId;
    const member = list.list_members.find((m) => m.user_id === userId);

    if (!isOwner && !member) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    const userRole = isOwner ? "owner" : member.role;

    res.json({
      success: true,
      data: {
        ...list,
        role: userRole,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crear una nueva lista
 * POST /api/lists
 *
 * NOTA: El trigger `on_list_created` en la base de datos se encarga
 * de crear automáticamente el registro en list_members para el owner
 */
const createList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { title, icon, color, configuration } = req.body;

    // Configuración por defecto si no se proporciona
    const defaultConfiguration = {
      type: "standard",
      show_dates: true,
      enable_assignments: true,
      restrict_editing_to_assignee: false,
    };

    const { data: list, error } = await supabase
      .from("todo_lists")
      .insert({
        title,
        owner_id: userId,
        icon: icon || "list",
        color: color || "#3B82F6",
        configuration: { ...defaultConfiguration, ...configuration },
      })
      .select()
      .single();

    if (error) throw error;

    // El trigger on_list_created se encarga de crear el list_member automáticamente

    res.status(201).json({
      success: true,
      message: "Lista creada exitosamente",
      data: {
        ...list,
        role: "owner",
        tasks: [], // Lista nueva sin tareas
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar una lista
 * PUT /api/lists/:id
 */
const updateList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { title, icon, color, configuration, is_archived } = req.body;

    // Verificar permisos (solo owner o editor)
    const { data: member, error: memberError } = await supabase
      .from("list_members")
      .select("role")
      .eq("list_id", id)
      .eq("user_id", userId)
      .single();

    if (memberError || !member || member.role === "viewer") {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (icon !== undefined) updateData.icon = icon;
    if (color !== undefined) updateData.color = color;
    if (configuration !== undefined) updateData.configuration = configuration;
    if (is_archived !== undefined) updateData.is_archived = is_archived;

    const { data: list, error } = await supabase
      .from("todo_lists")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Lista no encontrada",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Lista actualizada exitosamente",
      data: list,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar una lista
 * DELETE /api/lists/:id
 */
const deleteList = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar que el usuario sea el owner
    const { data: list, error: listError } = await supabase
      .from("todo_lists")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (listError || !list) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    if (list.owner_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    // Eliminar lista (cascade eliminará tasks, members, etc.)
    const { error } = await supabase.from("todo_lists").delete().eq("id", id);

    if (error) throw error;

    res.json({
      success: true,
      message: "Lista eliminada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener miembros de una lista
 * GET /api/lists/:id/members
 */
const getListMembers = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Verificar acceso a la lista
    const { data: member } = await supabase
      .from("list_members")
      .select("role")
      .eq("list_id", id)
      .eq("user_id", userId)
      .single();

    if (!member) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada",
      });
    }

    // Obtener todos los miembros con información de perfil
    const { data: members, error } = await supabase
      .from("list_members")
      .select(
        "role, joined_at, profiles(id, email, first_name, last_name, avatar_url)"
      )
      .eq("list_id", id);

    if (error) throw error;

    res.json({
      success: true,
      data: members,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Agregar miembro a una lista por email
 * POST /api/lists/:id/members
 */
const addListMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { email, role = "viewer" } = req.body;

    // Verificar que el usuario actual sea owner
    const { data: list } = await supabase
      .from("todo_lists")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!list || list.owner_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    // Buscar el usuario por email
    const { data: targetUser, error: userError } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name, avatar_url")
      .eq("email", email.toLowerCase())
      .single();

    if (userError || !targetUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado con ese email",
      });
    }

    // Verificar que no se intente añadir al owner
    if (targetUser.id === userId) {
      return res.status(400).json({
        success: false,
        message: "No puedes añadirte a ti mismo como miembro",
      });
    }

    // Agregar miembro
    const { data: newMember, error } = await supabase
      .from("list_members")
      .insert({
        list_id: id,
        user_id: targetUser.id,
        role,
      })
      .select(
        "role, joined_at, profiles(id, email, first_name, last_name, avatar_url)"
      )
      .single();

    if (error) {
      if (error.code === "23505") {
        return res.status(400).json({
          success: false,
          message: "El usuario ya es miembro de esta lista",
        });
      }
      throw error;
    }

    res.status(201).json({
      success: true,
      message: "Miembro agregado exitosamente",
      data: newMember,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar rol de miembro
 * PUT /api/lists/:id/members/:userId
 */
const updateListMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, userId: targetUserId } = req.params;
    const { role } = req.body;

    // Verificar que el usuario actual sea owner
    const { data: list } = await supabase
      .from("todo_lists")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!list || list.owner_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    // No permitir cambiar el rol del owner
    if (targetUserId === userId) {
      return res.status(400).json({
        success: false,
        message: "No puedes cambiar tu propio rol como owner",
      });
    }

    // Actualizar rol
    const { data: member, error } = await supabase
      .from("list_members")
      .update({ role })
      .eq("list_id", id)
      .eq("user_id", targetUserId)
      .select(
        "role, joined_at, profiles(id, email, first_name, last_name, avatar_url)"
      )
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Miembro no encontrado",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Rol actualizado exitosamente",
      data: member,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar miembro de una lista
 * DELETE /api/lists/:id/members/:userId
 */
const removeListMember = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id, userId: targetUserId } = req.params;

    // Verificar que el usuario actual sea owner
    const { data: list } = await supabase
      .from("todo_lists")
      .select("owner_id")
      .eq("id", id)
      .single();

    if (!list || list.owner_id !== userId) {
      return res.status(404).json({
        success: false,
        message: "Lista no encontrada o sin permisos",
      });
    }

    // No permitir eliminar al owner
    if (targetUserId === userId) {
      return res.status(400).json({
        success: false,
        message: "El owner no puede ser eliminado de la lista",
      });
    }

    // Eliminar miembro
    const { error } = await supabase
      .from("list_members")
      .delete()
      .eq("list_id", id)
      .eq("user_id", targetUserId);

    if (error) throw error;

    res.json({
      success: true,
      message: "Miembro eliminado exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLists,
  getListById,
  createList,
  updateList,
  deleteList,
  getListMembers,
  addListMember,
  updateListMember,
  removeListMember,
};
