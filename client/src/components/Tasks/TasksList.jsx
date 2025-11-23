import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { TaskCard } from "./TaskCard";
import { TasksFilter } from "./TasksFilter";
import { tagsApi } from "@/services/api";

export const TasksList = ({
  tasks,
  lists = [],
  filter,
  onFilterChange,
  onToggleTask,
  onUpdateTask,
  onDeleteTask,
}) => {
  const { t } = useTranslation();
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [hiddenTaskIds, setHiddenTaskIds] = useState(new Set());
  const [taskCount, setTaskCount] = useState(tasks.length);
  const [showCompleted, setShowCompleted] = useState(false);

  // OPTIMIZADO: Los tags ya vienen en cada lista desde el backend
  // Convertir a Map para acceso O(1)
  const listTagsMap = useMemo(() => {
    const map = new Map();
    lists.forEach((list) => {
      map.set(list.id, list.tags || []);
    });
    return map;
  }, [lists]);

  console.log("🔄 TasksList - Total tareas:", tasks.length);
  console.log("📋 TasksList - Listas disponibles:", lists.length);
  console.log("🏷️ TasksList - Tags map creado con", listTagsMap.size, "listas");

  // Detectar cuando cambia el número de tareas
  useEffect(() => {
    if (tasks.length !== taskCount) {
      console.log(
        "📊 Cambio en número de tareas:",
        taskCount,
        "->",
        tasks.length
      );
      setTaskCount(tasks.length);
    }
  }, [tasks.length, taskCount]);

  // Función para crear un tag y actualizar el map local
  const handleCreateTag = async (listId, name, color = "#3B82F6") => {
    try {
      const response = await tagsApi.createTag(listId, name, color);
      if (response.success) {
        // Nota: En producción, considera recargar las listas desde el backend
        // o implementar un estado global para sincronizar cambios
        return { success: true, data: response.data };
      }
    } catch (error) {
      console.error("Error creando tag:", error);
      return { success: false, error: error.message };
    }
  };

  const filteredTasks = tasks.filter((task) => {
    // Ocultar tareas marcadas como eliminadas
    if (hiddenTaskIds.has(task.id)) return false;

    // Filtrar por estado de completado
    if (!showCompleted && task.is_completed) return false;

    if (filter === "all") return true;
    // Filtrar por lista específica
    return task.list_id === filter || task.list?.id === filter;
  });

  console.log(
    "🔍 Tareas filtradas:",
    filteredTasks.length,
    "con filtro:",
    filter,
    "- Mostrar completadas:",
    showCompleted
  );

  const handleEditStart = (taskId) => {
    setEditingTaskId(taskId);
  };

  const handleEditEnd = () => {
    setEditingTaskId(null);
  };

  const handleSaveTask = async (taskId, editedData) => {
    // Encontrar la tarea original para obtener los objetos completos
    const originalTask = tasks.find((t) => t.id === taskId);
    if (!originalTask) return;

    // Preparar datos para el optimistic update (con objetos completos)
    const optimisticData = { ...editedData };

    // Preparar datos para enviar al backend (solo IDs)
    const backendData = { ...editedData };

    if (editedData.tags && Array.isArray(editedData.tags)) {
      // Para optimistic update: objetos completos
      const taskListId = originalTask.list_id;
      const availableTags = listTagsMap.get(taskListId) || [];
      optimisticData.tags = availableTags.filter((tag) =>
        editedData.tags.includes(tag.id)
      );

      // Para backend: solo IDs
      backendData.tags = editedData.tags;
    }

    if (editedData.assignees && Array.isArray(editedData.assignees)) {
      // Para optimistic update: objetos completos
      optimisticData.assignees =
        originalTask.assignees?.filter((assignee) =>
          editedData.assignees.includes(assignee.id)
        ) || [];

      // Para backend: solo IDs
      backendData.assignees = editedData.assignees;
    }

    // Actualizar inmediatamente con objetos completos
    if (onUpdateTask) {
      // Primero actualizamos localmente con optimisticData
      await onUpdateTask(taskId, optimisticData, backendData);
    }
    handleEditEnd();
  };

  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find((t) => t.id === taskId);
    if (!taskToDelete) return;

    console.log("🗑️ Ocultando tarea:", taskToDelete);

    // Iniciar animación de desaparición
    setDeletingTaskId(taskId);

    // Esperar a que termine la animación antes de ocultar
    setTimeout(() => {
      // Ocultar la tarea visualmente (pero NO eliminarla del backend aún)
      setHiddenTaskIds((prev) => new Set(prev).add(taskId));
      setDeletingTaskId(null);

      // Variable para rastrear si se canceló la eliminación
      let undoClicked = false;
      const TOAST_DURATION = 4000; // 4 segundos para deshacer

      // Mostrar toast con opción de deshacer y guardar su ID
      const toastId = toast(t("tasks.deleted"), {
        description: taskToDelete.title,
        duration: TOAST_DURATION,
        action: {
          label: t("tasks.undo"),
          onClick: () => {
            console.log(
              "🔄 Restaurando tarea (sin llamar al backend):",
              taskToDelete
            );
            undoClicked = true;

            // Simplemente quitar la tarea del Set de ocultas
            setHiddenTaskIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });

            toast.success(t("tasks.restored") || "Tarea restaurada");
          },
        },
      });

      // Después del tiempo del toast, eliminar del backend si no se canceló
      setTimeout(async () => {
        if (!undoClicked) {
          console.log(
            "⏱️ Tiempo expirado, eliminando tarea del backend:",
            taskId
          );

          try {
            const result = await onDeleteTask(taskId);

            if (result?.success) {
              console.log("✅ Tarea eliminada del backend exitosamente");
              // Cerrar el toast inmediatamente
              toast.dismiss(toastId);

              // Ya no necesitamos mantenerla en hiddenTaskIds porque se eliminó del state
              setHiddenTaskIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
              });
            } else {
              console.error(
                "❌ Error al eliminar tarea del backend:",
                result?.error
              );
              // Cerrar el toast de eliminación
              toast.dismiss(toastId);

              // Si falla la eliminación, volver a mostrar la tarea
              setHiddenTaskIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(taskId);
                return newSet;
              });
              toast.error(
                t("tasks.errorDeleting") || "Error al eliminar la tarea"
              );
            }
          } catch (error) {
            console.error("❌ Error eliminando tarea:", error);
            // Cerrar el toast de eliminación
            toast.dismiss(toastId);

            // Si falla, volver a mostrar la tarea
            setHiddenTaskIds((prev) => {
              const newSet = new Set(prev);
              newSet.delete(taskId);
              return newSet;
            });
            toast.error(
              t("tasks.errorDeleting") || "Error al eliminar la tarea"
            );
          }
        } else {
          console.log("✋ Eliminación cancelada por el usuario");
        }
      }, TOAST_DURATION);
    }, 300); // Duración de la animación
  };

  // Generar opciones de filtro dinámicamente basadas en las listas
  const filterOptions = [
    {
      id: "all",
      label: t("tasks.all"),
      count: tasks.filter((t) => !t.is_completed).length,
    },
    ...lists.map((list) => ({
      id: list.id,
      label: list.title,
      count: tasks.filter(
        (t) =>
          (t.list_id === list.id || t.list?.id === list.id) && !t.is_completed
      ).length,
    })),
  ];

  // Contar tareas completadas según el filtro activo
  const completedCount = useMemo(() => {
    return tasks.filter((task) => {
      if (hiddenTaskIds.has(task.id)) return false;
      if (!task.is_completed) return false;
      if (filter === "all") return true;
      return task.list_id === filter || task.list?.id === filter;
    }).length;
  }, [tasks, filter, hiddenTaskIds]);

  const handleToggleCompleted = () => {
    setShowCompleted((prev) => !prev);
  };

  return (
    <div className="tasks-column">
      <div className="tasks-header">
        <div className="tasks-header-top">
          <h2 className="section-title">{t("tasks.myTasks")}</h2>
          <span className="title-badge">
            {filteredTasks.filter((t) => !t.is_completed).length}
          </span>
        </div>

        {/* Modern select-based filter */}
        <TasksFilter
          options={filterOptions}
          active={filter}
          onChange={onFilterChange}
          showCompleted={showCompleted}
          onToggleCompleted={handleToggleCompleted}
          completedCount={completedCount}
        />
      </div>

      <div className="tasks-list">
        {/* Render active tasks */}
        {filteredTasks
          .filter((t) => !t.is_completed)
          .map((task) => {
            // Obtener los tags desde el map (acceso O(1))
            const taskListId = task.list_id;
            const availableTags = listTagsMap.get(taskListId) || [];
            // Obtener la lista específica de la tarea
            const taskList = lists.find((list) => list.id === taskListId);

            return (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                isEditing={editingTaskId === task.id}
                isDeleting={deletingTaskId === task.id}
                onEditStart={handleEditStart}
                onEditEnd={handleEditEnd}
                onSave={handleSaveTask}
                onDelete={handleDeleteTask}
                availableTags={availableTags}
                onCreateTag={async (name, color) =>
                  handleCreateTag(taskListId, name, color)
                }
                list={taskList}
              />
            );
          })}

        {/* Separator and completed tasks */}
        {showCompleted && filteredTasks.some((t) => t.is_completed) && (
          <>
            <div className="completed-tasks-separator">
              <span className="separator-line"></span>
              <span className="separator-text">{t("tasks.completed")}</span>
              <span className="separator-line"></span>
            </div>
            {filteredTasks
              .filter((t) => t.is_completed)
              .map((task) => {
                const taskListId = task.list_id;
                const availableTags = listTagsMap.get(taskListId) || [];
                const taskList = lists.find((list) => list.id === taskListId);

                return (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                    isEditing={editingTaskId === task.id}
                    isDeleting={deletingTaskId === task.id}
                    onEditStart={handleEditStart}
                    onEditEnd={handleEditEnd}
                    onSave={handleSaveTask}
                    onDelete={handleDeleteTask}
                    availableTags={availableTags}
                    onCreateTag={async (name, color) =>
                      handleCreateTag(taskListId, name, color)
                    }
                    list={taskList}
                  />
                );
              })}
          </>
        )}
      </div>
    </div>
  );
};
