// src/hooks/useListMembers.js
import { useState, useEffect, useCallback } from "react";
import { listsApi } from "@/services/api";

/**
 * Hook personalizado para manejar miembros de una lista
 */
export function useListMembers(listId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar miembros
  const loadMembers = useCallback(async () => {
    if (!listId) return;

    try {
      setLoading(true);
      setError(null);
      const response = await listsApi.getListMembers(listId);
      if (response.success) {
        setMembers(response.data);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error cargando miembros:", err);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  // Agregar miembro
  const addMember = useCallback(
    async (userId, role = "viewer") => {
      try {
        const response = await listsApi.addListMember(listId, userId, role);
        if (response.success) {
          setMembers((prev) => [...prev, response.data]);
          return { success: true, data: response.data };
        }
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
      } catch (err) {
        console.error("Error eliminando miembro:", err);
        return { success: false, error: err.message };
      }
    },
    [listId]
  );

  // Cargar miembros al montar
  useEffect(() => {
    if (listId) {
      loadMembers();
    }
  }, [listId, loadMembers]);

  return {
    members,
    loading,
    error,
    loadMembers,
    addMember,
    updateMemberRole,
    removeMember,
  };
}
