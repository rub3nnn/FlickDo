import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { tasksApi, tagsApi } from "@/services/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./AuthContext";

const TasksContext = createContext(null);

/**
 * Provider global para manejar todas las tareas y listas de la aplicación
 * Evita múltiples llamadas al backend desde diferentes componentes
 */
export function TasksProvider({ children }) {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para mostrar errores
  const handleError = (errorKey) => {
    toast.error(t(`tasks.${errorKey}`));
  };

  // Cargar todas las tareas del usuario
  const loadAllTasks = useCallback(
    async (includeCompleted = true) => {
      // No cargar tareas si no hay usuario autenticado
      if (!user) {
        setLoading(false);
        setTasks([]);
        setLists([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await tasksApi.getAllUserTasks(includeCompleted);
        if (response.success) {
          setTasks(response.data.tasks || []);
          setLists(response.data.lists || []);
        } else {
          setError(response.message || "Error cargando tareas");
          handleError("errorLoading");
        }
      } catch (err) {
        setError(err.message);
        // Solo mostrar error si el usuario está autenticado
        if (user) {
          handleError("errorLoading");
        }
        console.error("Error cargando todas las tareas:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Actualizar tarea con OPTIMISTIC UPDATE
  const updateTask = useCallback(
    async (id, optimisticData, backendData = null) => {
      // Si no se proporciona backendData, usar optimisticData
      const dataToSend = backendData || optimisticData;
      let previousTask = null;

      console.log("🔄 TasksContext.updateTask called:", {
        id,
        optimisticData,
        backendData,
        dataToSend,
      });

      // Actualizar inmediatamente (optimistic update)
      setTasks((prev) => {
        const taskIndex = prev.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
          console.warn("⚠️ Tarea no encontrada en el contexto:", id);
          return prev;
        }

        previousTask = prev[taskIndex];
        const updatedTask = { ...previousTask, ...optimisticData };

        console.log("✨ Optimistic update aplicado:", {
          before: previousTask,
          after: updatedTask,
        });

        const newTasks = [...prev];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      });

      try {
        const response = await tasksApi.updateTask(id, dataToSend);
        if (response.success) {
          console.log("✅ Backend confirmó actualización:", response.data);
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? response.data : task))
          );
          return { success: true, data: response.data };
        } else {
          console.error("❌ Backend rechazó actualización:", response.message);
          // Revertir al estado anterior si falla
          if (previousTask) {
            setTasks((prev) =>
              prev.map((task) => (task.id === id ? previousTask : task))
            );
          }
          handleError("errorUpdating");
          return { success: false, error: response.message };
        }
      } catch (err) {
        console.error("❌ Error actualizando tarea:", err);
        if (previousTask) {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? previousTask : task))
          );
        }
        handleError("errorUpdating");
        return { success: false, error: err.message };
      }
    },
    []
  );

  // Crear tarea con OPTIMISTIC UPDATE
  const createTask = useCallback(async (listId, data, insertIndex = null) => {
    const tempId = `temp-${Date.now()}`;
    const tempTask = {
      id: tempId,
      list_id: listId,
      is_completed: false,
      created_at: new Date().toISOString(),
      ...data,
    };

    try {
      // Actualizar inmediatamente (optimistic update)
      setTasks((prev) => {
        if (
          insertIndex !== null &&
          insertIndex >= 0 &&
          insertIndex <= prev.length
        ) {
          return [
            ...prev.slice(0, insertIndex),
            tempTask,
            ...prev.slice(insertIndex),
          ];
        }
        return [...prev, tempTask];
      });

      const response = await tasksApi.createTask(listId, data);

      if (response.success) {
        // Reemplazar la tarea temporal con la tarea real del servidor
        setTasks((prev) =>
          prev.map((task) => (task.id === tempId ? response.data : task))
        );
        return { success: true, data: response.data };
      } else {
        // Eliminar la tarea temporal si falla
        setTasks((prev) => prev.filter((task) => task.id !== tempId));
        handleError("errorCreating");
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error creando tarea:", err);
      setTasks((prev) => prev.filter((task) => task.id !== tempId));
      handleError("errorCreating");
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar tarea con OPTIMISTIC UPDATE
  const deleteTask = useCallback(async (id) => {
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
        handleError("errorDeleting");
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error eliminando tarea:", err);
      if (previousTask) {
        setTasks((prev) => [...prev, previousTask]);
      }
      handleError("errorDeleting");
      return { success: false, error: err.message };
    }
  }, []);

  // Toggle tarea completada con OPTIMISTIC UPDATE
  const toggleTaskCompleted = useCallback(async (id, isCompleted) => {
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
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? response.data : task))
        );
        return { success: true, data: response.data };
      } else {
        if (previousTask) {
          setTasks((prev) =>
            prev.map((task) => (task.id === id ? previousTask : task))
          );
        }
        handleError("errorToggling");
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error cambiando estado de tarea:", err);
      if (previousTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? previousTask : task))
        );
      }
      handleError("errorToggling");
      return { success: false, error: err.message };
    }
  }, []);

  // Crear tag con OPTIMISTIC UPDATE
  const createTag = useCallback(async (listId, name, color = "#3B82F6") => {
    if (!listId) {
      return { success: false, error: "No se ha especificado una lista" };
    }

    const tempId = `temp-tag-${Date.now()}`;
    const tempTag = {
      id: tempId,
      list_id: listId,
      name,
      color,
      created_at: new Date().toISOString(),
    };

    // Actualizar inmediatamente la lista con el nuevo tag (optimistic update)
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, tags: [...(list.tags || []), tempTag] }
          : list
      )
    );

    try {
      const response = await tagsApi.createTag(listId, name, color);
      if (response.success) {
        // Reemplazar el tag temporal con el tag real del servidor
        setLists((prev) =>
          prev.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  tags: (list.tags || []).map((tag) =>
                    tag.id === tempId ? response.data : tag
                  ),
                }
              : list
          )
        );
        return { success: true, data: response.data };
      } else {
        // Eliminar el tag temporal si falla
        setLists((prev) =>
          prev.map((list) =>
            list.id === listId
              ? {
                  ...list,
                  tags: (list.tags || []).filter((tag) => tag.id !== tempId),
                }
              : list
          )
        );
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error creando tag:", err);
      // Eliminar el tag temporal si hay una excepción
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? {
                ...list,
                tags: (list.tags || []).filter((tag) => tag.id !== tempId),
              }
            : list
        )
      );
      return { success: false, error: err.message };
    }
  }, []);

  // Cargar tareas al montar y cuando cambia el usuario
  useEffect(() => {
    if (user) {
      loadAllTasks(true); // Incluir completadas
    } else {
      // Limpiar tareas cuando no hay usuario
      setTasks([]);
      setLists([]);
      setLoading(false);
    }
  }, [user, loadAllTasks]);

  const value = {
    tasks,
    lists,
    loading,
    error,
    loadAllTasks,
    updateTask,
    createTask,
    deleteTask,
    toggleTaskCompleted,
    createTag,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

/**
 * Hook para acceder al contexto de tareas
 */
export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks debe usarse dentro de TasksProvider");
  }
  return context;
}
