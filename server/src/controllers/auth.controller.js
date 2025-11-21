const jwt = require("jsonwebtoken");
const { supabase } = require("../config/supabase");
const config = require("../config");

/**
 * Generar token JWT
 */
const generateToken = (userId, email) => {
  return jwt.sign({ userId, email }, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  });
};

/**
 * Registrar nuevo usuario
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;

    // Registrar usuario en Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name: name || "",
        },
      });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    // Crear perfil del usuario en la tabla users
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .insert({
        id: authData.user.id,
        email: authData.user.email,
        full_name: name || "",
        avatar_url: null,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (profileError) {
      console.error("Error creando perfil:", profileError);
      // Nota: El usuario ya fue creado en Auth, considera limpiar si falla
    }

    // Generar token JWT
    const token = generateToken(authData.user.id, authData.user.email);

    res.status(201).json({
      success: true,
      message: "Usuario registrado exitosamente",
      data: {
        token,
        user: authData.user, // Usuario de Supabase Auth
        profile: profileData || {
          id: authData.user.id,
          email: authData.user.email,
          full_name: name || "",
          avatar_url: null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login de usuario
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Autenticar con Supabase
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError) {
      console.error("Error obteniendo perfil:", profileError);
    }

    // Generar token JWT
    const token = generateToken(authData.user.id, authData.user.email);

    res.json({
      success: true,
      message: "Login exitoso",
      data: {
        token,
        user: authData.user, // Usuario de Supabase Auth
        profile: profile || {
          id: authData.user.id,
          email: authData.user.email,
          full_name: authData.user.user_metadata?.full_name || "",
          avatar_url: null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Login con provider (Google, GitHub, etc)
 * POST /api/auth/oauth/:provider
 */
const oauthLogin = async (req, res, next) => {
  try {
    const { provider } = req.params;
    const { redirectTo } = req.body;

    const validProviders = ["google", "github", "facebook"];

    if (!validProviders.includes(provider)) {
      return res.status(400).json({
        success: false,
        message: "Proveedor no válido",
      });
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectTo || `${config.clientUrl}/auth/callback`,
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      data: {
        url: data.url,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout de usuario
 * POST /api/auth/logout
 */
const logout = async (req, res, next) => {
  try {
    // En un sistema JWT stateless, el logout se maneja en el cliente
    // Aquí puedes implementar una lista negra de tokens si es necesario

    res.json({
      success: true,
      message: "Logout exitoso",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Solicitar reset de contraseña
 * POST /api/auth/reset-password
 */
const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${config.clientUrl}/reset-password`,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Email de recuperación enviado",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar contraseña
 * PUT /api/auth/update-password
 */
const updatePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.user.id;

    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Contraseña actualizada exitosamente",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener usuario actual
 * GET /api/auth/me
 */
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Obtener el usuario de Supabase Auth
    const { data: authUser, error: authError } =
      await supabase.auth.admin.getUserById(userId);

    if (authError) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado en Auth",
      });
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (profileError) {
      console.error("Error obteniendo perfil:", profileError);
    }

    res.json({
      success: true,
      data: {
        user: authUser.user, // Usuario de Supabase Auth
        profile: profile || {
          id: authUser.user.id,
          email: authUser.user.email,
          full_name: authUser.user.user_metadata?.full_name || "",
          avatar_url: null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  oauthLogin,
  logout,
  resetPassword,
  updatePassword,
  getCurrentUser,
};
