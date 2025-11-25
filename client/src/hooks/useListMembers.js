// src/hooks/useListMembers.js
import { useState, useEffect, useCallback } from "react";
import { listsApi } from "@/services/api";

/**
 * Hook personalizado para manejar miembros de una lista
 * @param {string|number} listId - ID de la lista
 * @param {object} options - Opciones de configuración
 * @param {boolean} options.lazy - Si es true, no carga automáticamente al montar
 */
export function useListMembers(listId, options = {}) {
  const { lazy = false } = options;
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Cargar miembros
  const loadMembers = useCallback(async () => {
    if (!listId) return;
    if (loaded && members.length > 0) return; // Ya cargados

    try {
      setLoading(true);
      setError(null);
      const response = await listsApi.getListMembers(listId);
      if (response.success) {
        setMembers(response.data);
        setLoaded(true);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error cargando miembros:", err);
    } finally {
      setLoading(false);
    }
  }, [listId, loaded, members.length]);

  // Agregar miembro por email
  const addMember = useCallback(
    async (email, role = "viewer") => {
      try {
        const response = await listsApi.addListMember(listId, email, role);
        if (response.success) {
          setMembers((prev) => [...prev, response.data]);
          return { success: true, data: response.data };
        }
        return { success: false, error: response.message };
      } catch (err) {
        console.error("Error agregando miembro:", err);
        return { success: false, error: err.message };
      }
    },
    [listId]
  );

  // Actualizar rol de miembro
  const updateMemberRole = useCallback(
    async (userId, role) => {
      try {
        const response = await listsApi.updateListMember(listId, userId, role);
        if (response.success) {
          setMembers((prev) =>
            prev.map((member) =>
              member.profiles.id === userId ? response.data : member
            )
          );
          return { success: true, data: response.data };
        }
        return { success: false, error: response.message };
      } catch (err) {
        console.error("Error actualizando rol de miembro:", err);
        return { success: false, error: err.message };
      }
    },
    [listId]
  );

  // Eliminar miembro
  const removeMember = useCallback(
    async (userId) => {
      try {
        const response = await listsApi.removeListMember(listId, userId);
        if (response.success) {
          setMembers((prev) =>
            prev.filter((member) => member.profiles.id !== userId)
          );
          return { success: true };
        }
        return { success: false, error: response.message };
      } catch (err) {
        console.error("Error eliminando miembro:", err);
        return { success: false, error: err.message };
      }
    },
    [listId]
  );

  // Cargar miembros al montar (solo si no es lazy)
  useEffect(() => {
    if (listId && !lazy) {
      loadMembers();
    }
  }, [listId, lazy, loadMembers]);

  return {
    members,
    loading,
    error,
    loaded,
    loadMembers,
    addMember,
    updateMemberRole,
    removeMember,
  };
}
