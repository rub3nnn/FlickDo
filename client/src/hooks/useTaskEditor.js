import { useState, useEffect, useCallback } from "react";

/**
 * Hook reutilizable para manejar la edición de tareas
 * Gestiona el estado de edición, validación de cambios y sincronización de datos
 *
 * @param {Object} task - La tarea original
 * @param {boolean} isEditing - Si la tarea está en modo edición
 * @param {Function} onSave - Callback al guardar cambios
 * @param {Function} onEditEnd - Callback al terminar la edición
 * @param {boolean} isNew - Si es una tarea nueva (modo creación)
 * @returns {Object} Estado y funciones para manejar la edición
 */
export function useTaskEditor(
  task,
  isEditing,
  onSave,
  onEditEnd,
  isNew = false
) {
  const [date, setDate] = useState(parseInitialDate(task.due_date));
  const [editedTask, setEditedTask] = useState(getInitialState(task));

  // Parsear la fecha inicial de forma segura
  function parseInitialDate(dateString) {
    if (!dateString) return undefined;
    try {
      const parsedDate = new Date(dateString);
      return isNaN(parsedDate.getTime()) ? undefined : parsedDate;
    } catch {
      return undefined;
    }
  }

  // Obtener estado inicial normalizado
  function getInitialState(task) {
    return {
      title: task.title || "",
      description: task.description || "",
      due_date: task.due_date || "",
      is_all_day: task.is_all_day || false,
      assignees: task.assignees?.map((a) => a.id) || [],
      tags: task.tags?.map((t) => t.id) || [],
    };
  }

  // Sincronizar el estado editado cuando cambian las props de la tarea
  useEffect(() => {
    if (!isEditing) {
      const newState = getInitialState(task);
      setEditedTask(newState);
      setDate(parseInitialDate(task.due_date));
    }
  }, [task, isEditing]);

  // Función para comparar si los datos han cambiado
  const hasChanges = useCallback(() => {
    const originalTags = task.tags?.map((t) => t.id) || [];
    const editedTags = editedTask.tags || [];
    const originalAssignees = task.assignees?.map((a) => a.id) || [];
    const editedAssignees = editedTask.assignees || [];

    // Comparar arrays de tags
    const tagsChanged =
      originalTags.length !== editedTags.length ||
      !originalTags.every((tag) => editedTags.includes(tag));

    // Comparar arrays de assignees
    const assigneesChanged =
      originalAssignees.length !== editedAssignees.length ||
      !originalAssignees.every((assignee) =>
        editedAssignees.includes(assignee)
      );

    return (
      (task.title || "") !== editedTask.title ||
      (task.description || "") !== editedTask.description ||
      (task.due_date || "") !== editedTask.due_date ||
      (task.is_all_day || false) !== editedTask.is_all_day ||
      assigneesChanged ||
      tagsChanged
    );
  }, [task, editedTask]);

  // Manejar guardado de cambios
  const handleSave = useCallback(async () => {
    // Para tareas nuevas, solo verificar que haya título
    if (isNew) {
      if (!editedTask.title?.trim()) {
        console.log("❌ No se puede crear tarea sin título");
        onEditEnd();
        return;
      }
      console.log("💾 Creando nueva tarea:", editedTask);
      if (onSave) {
        await onSave(task.id, editedTask);
      }
      return;
    }

    // Verificar si hay cambios antes de guardar (solo para edición)
    if (!hasChanges()) {
      console.log("✅ No hay cambios en la tarea, no se actualiza");
      onEditEnd();
      return;
    }

    // Guardar los cambios
    console.log("💾 Guardando cambios:", editedTask);
    if (onSave) {
      await onSave(task.id, editedTask);
    }
    onEditEnd();
  }, [hasChanges, editedTask, task.id, onSave, onEditEnd, isNew]);

  // Actualizar un campo específico
  const handleChange = useCallback((field, value) => {
    setEditedTask((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Actualizar fecha
  const handleDateChange = useCallback((newDate) => {
    setEditedTask((prev) => ({ ...prev, due_date: newDate }));
  }, []);

  // Actualizar is_all_day
  const handleAllDayChange = useCallback((newAllDay) => {
    setEditedTask((prev) => ({ ...prev, is_all_day: newAllDay }));
  }, []);

  // Limpiar fecha
  const handleDateClear = useCallback(() => {
    setEditedTask((prev) => ({ ...prev, due_date: null }));
    setDate(undefined);
  }, []);

  return {
    editedTask,
    date,
    setDate,
    hasChanges,
    handleSave,
    handleChange,
    handleDateChange,
    handleAllDayChange,
    handleDateClear,
  };
}
