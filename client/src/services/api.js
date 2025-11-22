const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const getToken = () => localStorage.getItem("auth_token");

const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
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
