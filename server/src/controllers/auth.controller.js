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
    const { email, password, firstName, lastName } = req.body;
    const fullName = `${firstName} ${lastName}`.trim();

    // Registrar usuario en Supabase Auth con signUp
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
        },
        emailRedirectTo: `${config.clientUrl}/auth/callback`,
      },
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: authError.message,
      });
    }

    // El perfil se crea automáticamente mediante trigger en la base de datos
    // No necesitamos crear el perfil manualmente aquí

    res.status(201).json({
      success: true,
      message:
        "Usuario registrado exitosamente. Por favor, verifica tu correo electrónico.",
      requiresEmailVerification: true,
      data: {
        email: authData.user.email,
        user: {
          id: authData.user.id,
          email: authData.user.email,
          first_name: firstName,
          last_name: lastName,
          full_name: fullName,
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
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verificar email del usuario
 * POST /api/auth/verify-email
 */
const verifyEmail = async (req, res, next) => {
  try {
    const { token_hash, type } = req.body;

    if (!token_hash || type !== "signup") {
      return res.status(400).json({
        success: false,
        message: "Token o tipo de verificación inválido",
      });
    }

    // Verificar el token con Supabase
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: "signup",
    });

    if (error) {
      console.error("Error verificando email:", error);
      return res.status(400).json({
        success: false,
        message: "Token inválido o expirado",
      });
    }

    if (!data.user) {
      return res.status(400).json({
        success: false,
        message: "No se pudo verificar el usuario",
      });
    }

    // Obtener perfil del usuario
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error obteniendo perfil:", profileError);
    }

    // Generar token JWT para el usuario verificado
    const token = generateToken(data.user.id, data.user.email);

    res.json({
      success: true,
      message: "Email verificado exitosamente",
      data: {
        token,
        user: data.user,
        profile: profile || {
          id: data.user.id,
          email: data.user.email,
          first_name: data.user.user_metadata?.first_name || "",
          last_name: data.user.user_metadata?.last_name || "",
          full_name: data.user.user_metadata?.full_name || "",
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Manejar callback de OAuth (Google, GitHub, etc.)
 * POST /api/auth/oauth-callback
 */
const handleOAuthCallback = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({
        success: false,
        message: "Token de acceso requerido",
      });
    }

    // Obtener el usuario usando el access token de Supabase
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return res.status(401).json({
        success: false,
        message: "Token inválido o usuario no encontrado",
      });
    }

    // Obtener o crear el perfil del usuario
    let { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    // Si no existe el perfil, se creará automáticamente por el trigger
    // Pero si aún no se ha creado, esperar un momento y reintentar
    if (profileError && profileError.code === "PGRST116") {
      // Esperar 500ms para que el trigger se ejecute
      await new Promise((resolve) => setTimeout(resolve, 500));

      const { data: retryProfile } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      profile = retryProfile;
    }

    // Generar token JWT para el usuario
    const token = generateToken(user.id, user.email);

    res.json({
      success: true,
      message: "Autenticación OAuth exitosa",
      data: {
        token,
        user,
        profile: profile || {
          id: user.id,
          email: user.email,
          first_name:
            user.user_metadata?.given_name ||
            user.user_metadata?.first_name ||
            "",
          last_name:
            user.user_metadata?.family_name ||
            user.user_metadata?.last_name ||
            "",
          full_name:
            user.user_metadata?.full_name || user.user_metadata?.name || "",
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
  handleOAuthCallback,
  logout,
  resetPassword,
  updatePassword,
  getCurrentUser,
  verifyEmail,
};
