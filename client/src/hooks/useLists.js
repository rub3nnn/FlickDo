// src/hooks/useLists.js
import { useState, useEffect, useCallback } from "react";
import { listsApi } from "@/services/api";

/**
 * Hook personalizado para manejar listas de tareas
 * @param {boolean} includeArchived - Incluir listas archivadas
 * @param {boolean} includeTasks - Incluir tareas de cada lista (optimizado en una sola consulta)
 */
export function useLists(includeArchived = false, includeTasks = false) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar listas
  const loadLists = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await listsApi.getLists(includeTasks);
      if (response.success) {
        setLists(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error cargando listas:", err);
    } finally {
      setLoading(false);
    }
  }, [includeTasks]);

  // Crear lista
  const createList = useCallback(async (title, configuration = null) => {
    try {
      const response = await listsApi.createList(title, configuration);
      if (response.success) {
        setLists((prev) => [...prev, response.data]);
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error creando lista:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Actualizar lista
  const updateList = useCallback(async (id, data) => {
    try {
      const response = await listsApi.updateList(id, data);
      if (response.success) {
        setLists((prev) =>
          prev.map((list) => (list.id === id ? response.data : list))
        );
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error actualizando lista:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Eliminar lista
  const deleteList = useCallback(async (id) => {
    try {
      const response = await listsApi.deleteList(id);
      if (response.success) {
        setLists((prev) => prev.filter((list) => list.id !== id));
        return { success: true };
      }
    } catch (err) {
      console.error("Error eliminando lista:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Archivar/desarchivar lista
  const toggleArchiveList = useCallback(async (id, isArchived) => {
    try {
      const response = await listsApi.updateList(id, {
        is_archived: !isArchived,
      });
      if (response.success) {
        setLists((prev) =>
          prev.map((list) => (list.id === id ? response.data : list))
        );
        return { success: true, data: response.data };
      }
    } catch (err) {
      console.error("Error archivando lista:", err);
      return { success: false, error: err.message };
    }
  }, []);

  // Cargar listas al montar
  useEffect(() => {
    loadLists();
  }, [loadLists]);

  return {
    lists,
    loading,
    error,
    loadLists,
    createList,
    updateList,
    deleteList,
    toggleArchiveList,
  };
}
