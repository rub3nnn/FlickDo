// src/hooks/useAllTasks.js
import { useState, useEffect, useCallback } from "react";
import { tasksApi } from "@/services/api";

/**
 * Hook personalizado para manejar todas las tareas del usuario
 * VERSIÓN OPTIMIZADA: Maneja tasks y lists por separado con OPTIMISTIC UPDATES
 */
export function useAllTasks(options = {}) {
  const { includeCompleted = true, autoLoad = true, onError } = options;

  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar todas las tareas del usuario
  const loadAllTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await tasksApi.getAllUserTasks(includeCompleted);
      if (response.success) {
        // El backend ahora devuelve { tasks: [...], lists: [...], metadata: {...} }
        setTasks(response.data.tasks || []);
        setLists(response.data.lists || []);
      } else {
        setError(response.message || "Error cargando tareas");
      }
    } catch (err) {
      setError(err.message);
      console.error("Error cargando todas las tareas:", err);
    } finally {
      setLoading(false);
    }
  }, [includeCompleted]);

  // Actualizar tarea con OPTIMISTIC UPDATE
  const updateTask = useCallback(
    async (id, optimisticData, backendData = null) => {
      // Si no se proporciona backendData, usar optimisticData para ambos
      const dataToSend = backendData || optimisticData;

      // Guardar el estado anterior para poder revertir
      let previousTask = null;

      // Actualizar inmediatamente (optimistic update con objetos completos)
      setTasks((prev) => {
        const taskIndex = prev.findIndex((task) => task.id === id);
        if (taskIndex === -1) return prev;

        previousTask = prev[taskIndex];
        const updatedTask = { ...previousTask, ...optimisticData };

        const newTasks = [...prev];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      });

      try {
        // Enviar al backend solo los IDs
        const response = await tasksApi.updateTask(id, dataToSend);
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

  // Crear tarea con OPTIMISTIC UPDATE
  const createTask = useCallback(
    async (listId, data, insertIndex = null) => {
      // Crear una tarea temporal con un ID temporal
      const tempId = `temp-${Date.now()}`;
      const tempTask = {
        id: tempId,
        list_id: listId,
        is_completed: false,
        created_at: new Date().toISOString(),
        ...data,
      };

      try {
        console.log("🔧 createTask - listId:", listId);
        console.log("🔧 createTask - data:", data);
        console.log("🔧 createTask - insertIndex:", insertIndex);

        // Actualizar inmediatamente (optimistic update)
        setTasks((prev) => {
          let newTasks;
          if (
            insertIndex !== null &&
            insertIndex >= 0 &&
            insertIndex <= prev.length
          ) {
            newTasks = [
              ...prev.slice(0, insertIndex),
              tempTask,
              ...prev.slice(insertIndex),
            ];
            console.log("📍 Insertando en posición:", insertIndex);
          } else {
            newTasks = [...prev, tempTask];
            console.log("📍 Agregando al final");
          }
          console.log(
            "📊 Tareas después de agregar (optimistic):",
            newTasks.length
          );
          return newTasks;
        });

        const response = await tasksApi.createTask(listId, data);
        console.log("🔧 createTask - response:", response);

        if (response.success) {
          console.log(
            "✨ Reemplazando tarea temporal con tarea real:",
            response.data
          );
          // Reemplazar la tarea temporal con la tarea real del servidor
          setTasks((prev) =>
            prev.map((task) => (task.id === tempId ? response.data : task))
          );
          return { success: true, data: response.data };
        } else {
          console.error("🔧 createTask - error en response:", response);
          // Eliminar la tarea temporal si falla
          setTasks((prev) => prev.filter((task) => task.id !== tempId));
          if (onError) onError("errorCreating");
          return { success: false, error: response.message };
        }
      } catch (err) {
        console.error("🔧 createTask - exception:", err);
        // Eliminar la tarea temporal si hay una excepción
        setTasks((prev) => prev.filter((task) => task.id !== tempId));
        if (onError) onError("errorCreating");
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
  );

  // Cargar tareas al montar (si autoLoad está habilitado)
  useEffect(() => {
    if (autoLoad) {
      loadAllTasks();
    }
  }, [autoLoad, loadAllTasks]);

  return {
    tasks,
    lists, // ← Ahora devolvemos las listas directamente
    loading,
    error,
    loadAllTasks,
    updateTask,
    createTask,
    deleteTask,
    toggleTaskCompleted,
  };
}
