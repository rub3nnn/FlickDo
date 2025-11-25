import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { tasksApi, tagsApi, listsApi } from "@/services/api";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { AuthContext } from "./AuthContext";

const TasksContext = createContext(null);

/**
 * Provider global para manejar todas las listas y tareas de la aplicación
 *
 * ESTRUCTURA DE DATOS:
 * - lists: Array de listas, cada lista tiene sus tareas en list.tasks
 * - tasks: Computed property que extrae todas las tareas de las listas (para compatibilidad)
 */
export function TasksProvider({ children }) {
  const { t } = useTranslation();
  const { user, isInitialized } = useContext(AuthContext);
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Computed: extraer todas las tareas de todas las listas (para compatibilidad)
  const tasks = useMemo(() => {
    return lists.flatMap((list) => list.tasks || []);
  }, [lists]);

  // Función para mostrar errores
  const handleError = (errorKey) => {
    toast.error(t(`tasks.${errorKey}`));
  };

  // Cargar todas las listas del usuario (con sus tareas incluidas)
  const loadAllTasks = useCallback(
    async (includeCompleted = true) => {
      // No cargar si no hay usuario autenticado
      if (!user) {
        setLists([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await tasksApi.getAllUserTasks(includeCompleted);
        if (response.success) {
          // La nueva estructura devuelve { lists: [...] }
          // Cada lista tiene sus tareas en list.tasks
          setLists(response.data.lists || []);
        } else {
          setError(response.message || "Error cargando listas");
          handleError("errorLoading");
        }
      } catch (err) {
        setError(err.message);
        if (user) {
          handleError("errorLoading");
        }
        console.error("Error cargando listas:", err);
      } finally {
        setLoading(false);
      }
    },
    [user]
  );

  // Actualizar tarea con OPTIMISTIC UPDATE
  const updateTask = useCallback(
    async (id, optimisticData, backendData = null) => {
      const dataToSend = backendData || optimisticData;
      let previousLists = null;

      console.log("🔄 TasksContext.updateTask called:", {
        id,
        optimisticData,
        backendData,
        dataToSend,
      });

      // Actualizar inmediatamente (optimistic update)
      setLists((prev) => {
        previousLists = prev;
        return prev.map((list) => ({
          ...list,
          tasks: (list.tasks || []).map((task) =>
            task.id === id ? { ...task, ...optimisticData } : task
          ),
        }));
      });

      try {
        const response = await tasksApi.updateTask(id, dataToSend);
        if (response.success) {
          console.log("✅ Backend confirmó actualización:", response.data);
          // Actualizar con los datos reales del servidor
          setLists((prev) =>
            prev.map((list) => ({
              ...list,
              tasks: (list.tasks || []).map((task) =>
                task.id === id ? response.data : task
              ),
            }))
          );
          return { success: true, data: response.data };
        } else {
          console.error("❌ Backend rechazó actualización:", response.message);
          if (previousLists) setLists(previousLists);
          handleError("errorUpdating");
          return { success: false, error: response.message };
        }
      } catch (err) {
        console.error("❌ Error actualizando tarea:", err);
        if (previousLists) setLists(previousLists);
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
      assignees: [],
      tags: [],
      ...data,
    };

    let previousLists = null;

    try {
      // Actualizar inmediatamente (optimistic update)
      setLists((prev) => {
        previousLists = prev;
        return prev.map((list) => {
          if (list.id !== listId) return list;
          const tasks = list.tasks || [];
          if (
            insertIndex !== null &&
            insertIndex >= 0 &&
            insertIndex <= tasks.length
          ) {
            return {
              ...list,
              tasks: [
                ...tasks.slice(0, insertIndex),
                tempTask,
                ...tasks.slice(insertIndex),
              ],
            };
          }
          return { ...list, tasks: [...tasks, tempTask] };
        });
      });

      const response = await tasksApi.createTask(listId, data);

      if (response.success) {
        // Reemplazar la tarea temporal con la real, marcándola como nueva para animación
        setLists((prev) =>
          prev.map((list) => ({
            ...list,
            tasks: (list.tasks || []).map((task) =>
              task.id === tempId ? { ...response.data, _isNew: true } : task
            ),
          }))
        );

        // Quitar el flag _isNew después de la animación
        setTimeout(() => {
          setLists((prev) =>
            prev.map((list) => ({
              ...list,
              tasks: (list.tasks || []).map((task) =>
                task._isNew ? { ...task, _isNew: false } : task
              ),
            }))
          );
        }, 400);

        return { success: true, data: response.data };
      } else {
        if (previousLists) setLists(previousLists);
        handleError("errorCreating");
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error creando tarea:", err);
      if (previousLists) setLists(previousLists);
      handleError("errorCreating");
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar tarea con OPTIMISTIC UPDATE
  const deleteTask = useCallback(async (id) => {
    let previousLists = null;

    // Eliminar inmediatamente (optimistic update)
    setLists((prev) => {
      previousLists = prev;
      return prev.map((list) => ({
        ...list,
        tasks: (list.tasks || []).filter((task) => task.id !== id),
      }));
    });

    try {
      const response = await tasksApi.deleteTask(id);
      if (response.success) {
        return { success: true };
      } else {
        if (previousLists) setLists(previousLists);
        handleError("errorDeleting");
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error eliminando tarea:", err);
      if (previousLists) setLists(previousLists);
      handleError("errorDeleting");
      return { success: false, error: err.message };
    }
  }, []);

  // Toggle tarea completada con OPTIMISTIC UPDATE
  const toggleTaskCompleted = useCallback(async (id, isCompleted) => {
    let previousLists = null;

    // Actualizar inmediatamente (optimistic update)
    setLists((prev) => {
      previousLists = prev;
      return prev.map((list) => ({
        ...list,
        tasks: (list.tasks || []).map((task) =>
          task.id === id ? { ...task, is_completed: !isCompleted } : task
        ),
      }));
    });

    try {
      const response = await tasksApi.updateTask(id, {
        is_completed: !isCompleted,
      });
      if (response.success) {
        setLists((prev) =>
          prev.map((list) => ({
            ...list,
            tasks: (list.tasks || []).map((task) =>
              task.id === id ? response.data : task
            ),
          }))
        );
        return { success: true, data: response.data };
      } else {
        if (previousLists) setLists(previousLists);
        handleError("errorToggling");
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error cambiando estado de tarea:", err);
      if (previousLists) setLists(previousLists);
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
      name,
      color,
      created_at: new Date().toISOString(),
    };

    let previousLists = null;

    // Actualizar inmediatamente la lista con el nuevo tag
    setLists((prev) => {
      previousLists = prev;
      return prev.map((list) =>
        list.id === listId
          ? { ...list, tags: [...(list.tags || []), tempTag] }
          : list
      );
    });

    try {
      const response = await tagsApi.createTag(listId, name, color);
      if (response.success) {
        // Reemplazar el tag temporal con el real
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
        if (previousLists) setLists(previousLists);
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error creando tag:", err);
      if (previousLists) setLists(previousLists);
      return { success: false, error: err.message };
    }
  }, []);

  // Crear lista con OPTIMISTIC UPDATE
  const createList = useCallback(async (listData) => {
    const tempId = `temp-list-${Date.now()}`;
    const tempList = {
      id: tempId,
      title: listData.title,
      icon: listData.icon || "list",
      color: listData.color || "#3B82F6",
      configuration: listData.configuration || {
        type: "standard",
        show_dates: true,
        enable_assignments: true,
        restrict_editing_to_assignee: false,
      },
      is_shared: false,
      is_archived: false,
      created_at: new Date().toISOString(),
      tags: [],
      tasks: [], // Lista vacía de tareas
    };

    let previousLists = null;

    // Actualizar inmediatamente (optimistic update)
    setLists((prev) => {
      previousLists = prev;
      return [tempList, ...prev]; // Añadir al principio
    });

    try {
      const response = await listsApi.createList(listData);
      if (response.success) {
        // Reemplazar la lista temporal con la real
        setLists((prev) =>
          prev.map((list) =>
            list.id === tempId
              ? { ...response.data, tasks: [], tags: [] }
              : list
          )
        );
        return { success: true, data: response.data };
      } else {
        if (previousLists) setLists(previousLists);
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error creando lista:", err);
      if (previousLists) setLists(previousLists);
      return { success: false, error: err.message };
    }
  }, []);

  // Actualizar lista
  const updateList = useCallback(async (id, data) => {
    let previousLists = null;

    // Actualizar inmediatamente (optimistic update)
    setLists((prev) => {
      previousLists = prev;
      return prev.map((list) => (list.id === id ? { ...list, ...data } : list));
    });

    try {
      const response = await listsApi.updateList(id, data);
      if (response.success) {
        // Mantener las tareas y tags existentes
        setLists((prev) =>
          prev.map((list) =>
            list.id === id
              ? { ...response.data, tasks: list.tasks, tags: list.tags }
              : list
          )
        );
        return { success: true, data: response.data };
      } else {
        if (previousLists) setLists(previousLists);
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error actualizando lista:", err);
      if (previousLists) setLists(previousLists);
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar lista
  const deleteList = useCallback(async (id) => {
    let previousLists = null;
    const listIdStr = String(id);

    setLists((prev) => {
      previousLists = prev;
      return prev.filter((list) => String(list.id) !== listIdStr);
    });

    try {
      const response = await listsApi.deleteList(id);
      if (response.success) {
        return { success: true };
      } else {
        if (previousLists) setLists(previousLists);
        return { success: false, error: response.message };
      }
    } catch (err) {
      console.error("Error eliminando lista:", err);
      if (previousLists) setLists(previousLists);
      return { success: false, error: err.message };
    }
  }, []);

  // Cargar listas al montar y cuando cambia el usuario
  useEffect(() => {
    // Esperar a que AuthContext esté inicializado
    if (!isInitialized) {
      return;
    }

    if (user) {
      loadAllTasks(true); // Incluir completadas
    } else {
      // Limpiar cuando no hay usuario
      setLists([]);
      setLoading(false);
    }
  }, [user, isInitialized, loadAllTasks]);

  const value = {
    tasks, // Computed: todas las tareas extraídas de las listas
    lists, // Listas con sus tareas anidadas en list.tasks
    loading,
    error,
    loadAllTasks,
    updateTask,
    createTask,
    deleteTask,
    toggleTaskCompleted,
    createTag,
    createList,
    updateList,
    deleteList,
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
