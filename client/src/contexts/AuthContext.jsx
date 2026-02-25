// src/contexts/AuthContext.jsx
import { createContext, useState, useEffect } from "react";
import { authApi } from "@/services/api";
import { mockUser, mockProfile } from "@/data/mockData";

export const AuthContext = createContext({});

// Variable para controlar el modo preview
const IS_PREVIEW_MODE = true;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Usuario de Supabase Auth
  const [profile, setProfile] = useState(null); // Perfil de la tabla users
  const [session, setSession] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      // En modo preview, usar datos mock directamente
      if (IS_PREVIEW_MODE) {
        if (mounted) {
          setUser(mockUser);
          setProfile(mockProfile);
          setSession({ access_token: "preview-token" });
          setIsInitialized(true);
        }
        return;
      }

      // Código original para modo producción
      try {
        const token = localStorage.getItem("auth_token");

        if (!token) {
          if (mounted) {
            setIsInitialized(true);
          }
          return;
        }

        // Verificar token con el backend
        const response = await authApi.getCurrentUser();

        if (mounted && response.success) {
          setUser(response.data.user); // Usuario de Auth
          setProfile(response.data.profile); // Perfil de la tabla users
          setSession({ access_token: token });
        }
      } catch (error) {
        console.error("Error inicializando auth:", error);
        // Token inválido o expirado, limpiar
        localStorage.removeItem("auth_token");
        if (mounted) {
          setUser(null);
          setProfile(null);
          setSession(null);
        }
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email, password) => {
    if (IS_PREVIEW_MODE) {
      // En modo preview, simular login exitoso
      setUser(mockUser);
      setProfile(mockProfile);
      setSession({ access_token: "preview-token" });
      return { data: { user: mockUser }, error: null };
    }

    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        const { token, user, profile } = response.data;

        // Guardar token
        localStorage.setItem("auth_token", token);

        // Actualizar estado
        setUser(user); // Usuario de Auth
        setProfile(profile); // Perfil de la tabla users
        setSession({ access_token: token });

        return { data: { user }, error: null };
      }
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signUp = async (email, password, metadata = {}) => {
    try {
      const response = await authApi.register(
        email,
        password,
        metadata.firstName,
        metadata.lastName,
      );

      if (response.success) {
        if (response.requiresEmailVerification) {
          // Usuario creado pero requiere verificación
          return {
            data: null,
            error: null,
            requiresEmailVerification: true,
            email: response.data.email,
          };
        }

        // Usuario creado y puede iniciar sesión (no debería pasar con la nueva config)
        const { token, user, profile } = response.data;

        // Guardar token
        localStorage.setItem("auth_token", token);

        // Actualizar estado
        setUser(user); // Usuario de Auth
        setProfile(profile); // Perfil de la tabla users
        setSession({ access_token: token });

        return { data: { user }, error: null };
      }
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signInWithProvider = async (provider) => {
    // En modo preview, no permitir OAuth
    if (IS_PREVIEW_MODE) {
      console.log("OAuth deshabilitado en modo preview");
      return {
        data: null,
        error: { message: "OAuth no disponible en modo preview" },
      };
    }

    try {
      const response = await authApi.oauthLogin(
        provider,
        `${window.location.origin}/auth/callback`,
      );

      if (response.success && response.data.url) {
        // Redirigir a la URL de OAuth de Supabase
        window.location.href = response.data.url;
        return { data: response.data, error: null };
      }
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const signOut = async () => {
    if (IS_PREVIEW_MODE) {
      // En modo preview, simplemente limpiar el estado (pero mantener el usuario logueado)
      // No permitimos logout en el preview
      return { error: null };
    }

    try {
      await authApi.logout();
      localStorage.removeItem("auth_token");
      setUser(null);
      setProfile(null);
      setSession(null);
      return { error: null };
    } catch (error) {
      // Aunque falle el backend, limpiamos localmente
      localStorage.removeItem("auth_token");
      setUser(null);
      setProfile(null);
      setSession(null);
      return { error: { message: error.message } };
    }
  };

  const resetPassword = async (email) => {
    try {
      const response = await authApi.resetPassword(email);

      if (response.success) {
        return { data: response.data, error: null };
      }
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const response = await authApi.updatePassword(newPassword);

      if (response.success) {
        return { data: response.data, error: null };
      }
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  };

  const value = {
    user, // Usuario de Supabase Auth (id, email, user_metadata, created_at, etc.)
    profile, // Perfil de la tabla users (full_name, avatar_url, etc.)
    session,
    isInitialized,
    signIn,
    signUp,
    signInWithProvider,
    signOut,
    resetPassword,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
