// src/hooks/useTags.js
import { useState, useEffect, useCallback } from "react";
import { tagsApi } from "@/services/api";

/**
 * Hook personalizado para manejar etiquetas de una lista
 * @param {number} listId - ID de la lista
 */
export function useTags(listId) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar etiquetas
  const loadTags = useCallback(async () => {
    if (!listId) {
      setTags([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await tagsApi.getTags(listId);
      if (response.success) {
        setTags(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error cargando etiquetas:", err);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // Crear etiqueta
  const createTag = useCallback(
    async (name, color = "#3B82F6") => {
      if (!listId) {
        return { success: false, error: "No se ha especificado una lista" };
      }

      try {
        const response = await tagsApi.createTag(listId, name, color);
        if (response.success) {
          setTags((prev) => [...prev, response.data]);
          return { success: true, data: response.data };
        }
      } catch (err) {
        console.error("Error creando etiqueta:", err);
        return { success: false, error: err.message };
      }
    },
    [listId]
  );

  // Actualizar etiqueta
  const updateTag = useCallback(
    async (id, data) => {
      if (!listId) {
        return { success: false, error: "No se ha especificado una lista" };
      }

      try {
        const response = await tagsApi.updateTag(listId, id, data);
        if (response.success) {
          setTags((prev) =>
            prev.map((tag) => (tag.id === id ? response.data : tag))
          );
          return { success: true, data: response.data };
        }
      } catch (err) {
        console.error("Error actualizando etiqueta:", err);
        return { success: false, error: err.message };
      }
    },
    [listId]
  );

  // Eliminar etiqueta
  const deleteTag = useCallback(
    async (id) => {
      if (!listId) {
        return { success: false, error: "No se ha especificado una lista" };
      }

      try {
        const response = await tagsApi.deleteTag(listId, id);
        if (response.success) {
          setTags((prev) => prev.filter((tag) => tag.id !== id));
          return { success: true };
        }
      } catch (err) {
        console.error("Error eliminando etiqueta:", err);
        return { success: false, error: err.message };
      }
    },
    [listId]
  );

  // Cargar etiquetas al montar o cuando cambie listId
  useEffect(() => {
    loadTags();
  }, [loadTags]);

  return {
    tags,
    loading,
    error,
    loadTags,
    createTag,
    updateTag,
    deleteTag,
  };
}
