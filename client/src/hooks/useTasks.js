// src/hooks/useTasks.js
import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "@/services/api";

/**
 * Hook personalizado para manejar tareas con OPTIMISTIC UPDATES
 */
export function useTasks(listId, options = {}) {
  const {
    parentId = null,
    includeCompleted = true,
    autoLoad = true,
    onError,
  } = options;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar tareas
  const loadTasks = useCallback(async () => {
    if (!listId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getTasks(
        listId,
        parentId,
        includeCompleted
      );
      if (response.success) {
        setTasks(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error cargando tareas:", err);
    } finally {
      setLoading(false);
    }
  }, [listId, parentId, includeCompleted]);

  // Crear tarea con OPTIMISTIC UPDATE
  const createTask = useCallback(
    async (taskData) => {
      // Crear una tarea temporal con un ID temporal
      const tempId = `temp-${Date.now()}`;
      const tempTask = {
        id: tempId,
        list_id: listId,
        is_completed: false,
        created_at: new Date().toISOString(),
        ...taskData,
      };

      // Actualizar inmediatamente (optimistic update)
      setTasks((prev) => [...prev, tempTask]);

      try {
        const response = await tasksApi.createTask(listId, taskData);
        if (response.success) {
          // Reemplazar la tarea temporal con la tarea real del servidor
          setTasks((prev) =>
            prev.map((task) => (task.id === tempId ? response.data : task))
          );
          return { success: true, data: response.data };
        } else {
          // Eliminar la tarea temporal si falla
          setTasks((prev) => prev.filter((task) => task.id !== tempId));
          if (onError) onError("errorCreating");
          return { success: false, error: response.message };
        }
      } catch (err) {
        console.error("Error creando tarea:", err);
        // Eliminar la tarea temporal si hay una excepción
        setTasks((prev) => prev.filter((task) => task.id !== tempId));
        if (onError) onError("errorCreating");
        return { success: false, error: err.message };
      }
    },
    [listId, onError]
  );

  // Actualizar tarea con OPTIMISTIC UPDATE
  const updateTask = useCallback(
    async (id, data) => {
      // Guardar el estado anterior para poder revertir
      let previousTask = null;

      // Actualizar inmediatamente (optimistic update)
      setTasks((prev) => {
        const taskIndex = prev.findIndex((task) => task.id === id);
        if (taskIndex === -1) return prev;

        previousTask = prev[taskIndex];
        const updatedTask = { ...previousTask, ...data };

        const newTasks = [...prev];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      });

      try {
        const response = await tasksApi.updateTask(id, data);
        if (response.success) {
          // Actualizar con los datos reales del servidor
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? response.data : task))
          );
          return { success: true, data: response.data };
        } else {
          // Revertir al estado anterior si falla
          if (previousTask) {
            setTasks((prev) =>
              prev.map((task) => (task.id === id ? previousTask : task))
            );
          }
          if (onError) onError("errorUpdating");
          return { success: false, error: response.message };
        }
      } catch (err) {
        console.error("Error actualizando tarea:", err);
        // Revertir al estado anterior si hay una excepción
        if (previousTask) {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? previousTask : task))
          );
        }
        if (onError) onError("errorUpdating");
        return { success: false, error: err.message };
      }
    },
    [onError]
  );

  // Eliminar tarea con OPTIMISTIC UPDATE
  const deleteTask = useCallback(
    async (id) => {
      // Guardar la tarea anterior para poder revertir
      let previousTask = null;

      // Eliminar inmediatamente (optimistic update)
      setTasks((prev) => {
        const taskIndex = prev.findIndex((task) => task.id === id);
        if (taskIndex !== -1) {
          previousTask = prev[taskIndex];
        }
        return prev.filter((task) => task.id !== id);
      });

      try {
        const response = await tasksApi.deleteTask(id);
        if (response.success) {
          return { success: true };
        } else {
          // Revertir al estado anterior si falla
          if (previousTask) {
            setTasks((prev) => [...prev, previousTask]);
          }
          if (onError) onError("errorDeleting");
          return { success: false, error: response.message };
        }
      } catch (err) {
        console.error("Error eliminando tarea:", err);
        // Revertir al estado anterior si hay una excepción
        if (previousTask) {
          setTasks((prev) => [...prev, previousTask]);
        }
        if (onError) onError("errorDeleting");
        return { success: false, error: err.message };
      }
    },
    [onError]
  );

  // Toggle tarea completada con OPTIMISTIC UPDATE
  const toggleTaskCompleted = useCallback(
    async (id, isCompleted) => {
      // Guardar el estado anterior para poder revertir
      let previousTask = null;

      // Actualizar inmediatamente (optimistic update)
      setTasks((prev) => {
        const taskIndex = prev.findIndex((task) => task.id === id);
        if (taskIndex === -1) return prev;

        previousTask = prev[taskIndex];
        const updatedTask = { ...previousTask, is_completed: !isCompleted };

        const newTasks = [...prev];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      });

      try {
        const response = await tasksApi.updateTask(id, {
          is_completed: !isCompleted,
        });
        if (response.success) {
          // Actualizar con los datos reales del servidor
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? response.data : task))
          );
          return { success: true, data: response.data };
        } else {
          // Revertir al estado anterior si falla
          if (previousTask) {
            setTasks((prev) =>
              prev.map((task) => (task.id === id ? previousTask : task))
            );
          }
          if (onError) onError("errorToggling");
          return { success: false, error: response.message };
        }
      } catch (err) {
        console.error("Error cambiando estado de tarea:", err);
        // Revertir al estado anterior si hay una excepción
        if (previousTask) {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? previousTask : task))
          );
        }
        if (onError) onError("errorToggling");
        return { success: false, error: err.message };
      }
    },
    [onError]
  ); // Cargar tareas al montar (si autoLoad está habilitado)
  useEffect(() => {
    if (autoLoad && listId) {
      loadTasks();
    }
  }, [autoLoad, listId, loadTasks]);

  return {
    tasks,
    loading,
    error,
    loadTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskCompleted,
  };
}
