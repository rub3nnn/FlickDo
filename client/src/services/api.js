const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("auth_token");

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    // Log validation errors for debugging
    if (data.errors && Array.isArray(data.errors)) {
      console.error("Validation errors:", JSON.stringify(data.errors, null, 2));
    }
    throw new Error(data.message || "Error en la petición");
  }

  return data;
};

export const authApi = {
  // Registro
  register: async (email, password, firstName, lastName) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, firstName, lastName }),
    });
    return handleResponse(response);
  },

  // Login
  login: async (email, password) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  // OAuth
  oauthLogin: async (provider, redirectTo) => {
    const response = await fetch(`${API_URL}/auth/oauth/${provider}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ redirectTo }),
    });
    return handleResponse(response);
  },

  // Obtener usuario actual
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Logout
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Reset password
  resetPassword: async (email) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return handleResponse(response);
  },

  // Update password
  updatePassword: async (newPassword) => {
    const response = await fetch(`${API_URL}/auth/update-password`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ newPassword }),
    });
    return handleResponse(response);
  },

  // Verify email
  verifyEmail: async (token_hash, type) => {
    const response = await fetch(`${API_URL}/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token_hash, type }),
    });
    return handleResponse(response);
  },

  // Handle OAuth callback
  handleOAuthCallback: async (accessToken, refreshToken) => {
    const response = await fetch(`${API_URL}/auth/oauth-callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken, refreshToken }),
    });
    return handleResponse(response);
  },
};

// API de listas
export const listsApi = {
  // Obtener todas las listas del usuario
  getLists: async (includeTasks = false) => {
    const params = new URLSearchParams();
    if (includeTasks) params.append("include_tasks", "true");

    const response = await fetch(
      `${API_URL}/lists${params.toString() ? `?${params.toString()}` : ""}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return handleResponse(response);
  },

  // Obtener lista por ID
  getListById: async (id) => {
    const response = await fetch(`${API_URL}/lists/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Crear lista
  createList: async (data) => {
    const response = await fetch(`${API_URL}/lists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Actualizar lista
  updateList: async (id, data) => {
    const response = await fetch(`${API_URL}/lists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Eliminar lista
  deleteList: async (id) => {
    const response = await fetch(`${API_URL}/lists/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Obtener miembros de una lista
  getListMembers: async (listId) => {
    const response = await fetch(`${API_URL}/lists/${listId}/members`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Añadir miembro a una lista por email
  addListMember: async (listId, email, role = "viewer") => {
    const response = await fetch(`${API_URL}/lists/${listId}/members`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify({ email, role }),
    });
    return handleResponse(response);
  },

  // Actualizar rol de miembro
  updateListMember: async (listId, userId, role) => {
    const response = await fetch(
      `${API_URL}/lists/${listId}/members/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ role }),
      }
    );
    return handleResponse(response);
  },

  // Eliminar miembro de una lista
  removeListMember: async (listId, userId) => {
    const response = await fetch(
      `${API_URL}/lists/${listId}/members/${userId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return handleResponse(response);
  },

  // Salir de una lista compartida
  leaveList: async (listId) => {
    const response = await fetch(`${API_URL}/lists/${listId}/leave`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },
};

// API de tareas
export const tasksApi = {
  // Obtener todas las tareas del usuario (de todas sus listas) - OPTIMIZADO
  getAllUserTasks: async (includeCompleted = true) => {
    const params = new URLSearchParams();
    params.append("include_completed", includeCompleted);

    const response = await fetch(`${API_URL}/tasks?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Obtener tareas de una lista específica
  getTasks: async (listId, parentId = null, includeCompleted = true) => {
    const params = new URLSearchParams();
    if (parentId !== null) params.append("parent_id", parentId);
    params.append("include_completed", includeCompleted);

    const response = await fetch(
      `${API_URL}/lists/${listId}/tasks?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return handleResponse(response);
  },

  // Obtener tarea por ID
  getTaskById: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Crear tarea
  createTask: async (listId, data) => {
    const response = await fetch(`${API_URL}/lists/${listId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Actualizar tarea
  updateTask: async (id, data) => {
    console.log("📤 Sending updateTask:", { id, data: JSON.stringify(data) });
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Eliminar tarea
  deleteTask: async (id) => {
    const response = await fetch(`${API_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Obtener subtareas
  getSubtasks: async (taskId) => {
    const response = await fetch(`${API_URL}/tasks/${taskId}/subtasks`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },
};

// API de etiquetas
export const tagsApi = {
  // Obtener todas las etiquetas de una lista
  getTags: async (listId) => {
    const response = await fetch(`${API_URL}/lists/${listId}/tags`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Obtener etiqueta por ID
  getTagById: async (listId, id) => {
    const response = await fetch(`${API_URL}/lists/${listId}/tags/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Crear etiqueta
  createTag: async (listId, name, color = "#3B82F6") => {
    const payload = { name, color };

    const response = await fetch(`${API_URL}/lists/${listId}/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(payload),
    });
    return handleResponse(response);
  },

  // Actualizar etiqueta
  updateTag: async (listId, id, data) => {
    const response = await fetch(`${API_URL}/lists/${listId}/tags/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Eliminar etiqueta
  deleteTag: async (listId, id) => {
    const response = await fetch(`${API_URL}/lists/${listId}/tags/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  // Obtener tareas con una etiqueta específica
  getTasksByTag: async (listId, id) => {
    const response = await fetch(
      `${API_URL}/lists/${listId}/tags/${id}/tasks`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      }
    );
    return handleResponse(response);
  },
};
