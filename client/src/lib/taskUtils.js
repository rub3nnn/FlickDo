/**
 * Utilidades para normalizar las actualizaciones de tareas
 * Asegura que los datos se manejen de forma consistente en todo el sistema
 */

/**
 * Prepara los datos de una tarea editada para enviar al backend
 * Convierte arrays de objetos a arrays de IDs
 * @param {Object} editedData - Los datos editados de la tarea
 * @returns {Object} Datos preparados para el backend
 */
export function prepareTaskForBackend(editedData) {
  const backendData = { ...editedData };

  // Convertir tags a array de IDs si son objetos
  if (editedData.tags && Array.isArray(editedData.tags)) {
    backendData.tags = editedData.tags.map((tag) =>
      typeof tag === "object" ? tag.id : tag
    );
  }

  // Convertir assignees a array de IDs si son objetos
  if (editedData.assignees && Array.isArray(editedData.assignees)) {
    backendData.assignees = editedData.assignees.map((assignee) =>
      typeof assignee === "object" ? assignee.id : assignee
    );
  }

  return backendData;
}

/**
 * Prepara los datos para la actualización optimista
 * Convierte IDs a objetos completos usando los datos de referencia
 * @param {Object} editedData - Los datos editados
 * @param {Object} originalTask - La tarea original con objetos completos
 * @param {Array} availableTags - Tags disponibles en la lista
 * @returns {Object} Datos preparados para el optimistic update
 */
export function prepareTaskForOptimisticUpdate(
  editedData,
  originalTask,
  availableTags = []
) {
  const optimisticData = { ...editedData };

  // Convertir tags de IDs a objetos completos
  if (editedData.tags && Array.isArray(editedData.tags)) {
    optimisticData.tags = availableTags.filter((tag) =>
      editedData.tags.includes(typeof tag === "object" ? tag.id : tag)
    );
  }

  // Convertir assignees de IDs a objetos completos
  if (editedData.assignees && Array.isArray(editedData.assignees)) {
    const originalAssignees = originalTask.assignees || [];
    optimisticData.assignees = originalAssignees.filter((assignee) =>
      editedData.assignees.includes(
        typeof assignee === "object" ? assignee.id : assignee
      )
    );
  }

  return optimisticData;
}

/**
 * Compara dos tareas para determinar si tienen cambios
 * @param {Object} originalTask - La tarea original
 * @param {Object} editedData - Los datos editados
 * @returns {boolean} True si hay cambios
 */
export function hasTaskChanges(originalTask, editedData) {
  const originalTags = originalTask.tags?.map((t) => t.id) || [];
  const editedTags = (editedData.tags || []).map((t) =>
    typeof t === "object" ? t.id : t
  );
  const originalAssignees = originalTask.assignees?.map((a) => a.id) || [];
  const editedAssignees = (editedData.assignees || []).map((a) =>
    typeof a === "object" ? a.id : a
  );

  // Comparar arrays de tags
  const tagsChanged =
    originalTags.length !== editedTags.length ||
    !originalTags.every((tag) => editedTags.includes(tag));

  // Comparar arrays de assignees
  const assigneesChanged =
    originalAssignees.length !== editedAssignees.length ||
    !originalAssignees.every((assignee) => editedAssignees.includes(assignee));

  return (
    (originalTask.title || "") !== (editedData.title || "") ||
    (originalTask.description || "") !== (editedData.description || "") ||
    (originalTask.due_date || "") !== (editedData.due_date || "") ||
    (originalTask.is_all_day || false) !== (editedData.is_all_day || false) ||
    assigneesChanged ||
    tagsChanged
  );
}

/**
 * Normaliza una tarea para asegurar que todos los campos estén presentes
 * @param {Object} task - La tarea a normalizar
 * @returns {Object} Tarea normalizada
 */
export function normalizeTask(task) {
  return {
    ...task,
    title: task.title || "",
    description: task.description || "",
    due_date: task.due_date || null,
    is_all_day: task.is_all_day || false,
    is_completed: task.is_completed || false,
    tags: task.tags || [],
    assignees: task.assignees || [],
  };
}
