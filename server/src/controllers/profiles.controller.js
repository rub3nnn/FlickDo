const { supabase } = require("../config/supabase");

/**
 * Obtener perfil del usuario actual
 * GET /api/profiles/me
 */
const getMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Perfil no encontrado",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar perfil del usuario actual
 * PUT /api/profiles/me
 */
const updateMyProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, avatar_url, preferences } = req.body;

    // Preparar datos de actualización
    const updateData = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (preferences !== undefined) updateData.preferences = preferences;
    updateData.updated_at = new Date().toISOString();

    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Perfil no encontrado",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      message: "Perfil actualizado exitosamente",
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener perfil de otro usuario por ID
 * GET /api/profiles/:id
 */
const getProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name, avatar_url")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          success: false,
          message: "Perfil no encontrado",
        });
      }
      throw error;
    }

    res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Buscar usuarios por email (para invitaciones)
 * GET /api/profiles/search?email=
 */
const searchProfiles = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email || email.length < 3) {
      return res.status(400).json({
        success: false,
        message: "El email debe tener al menos 3 caracteres",
      });
    }

    const { data: profiles, error } = await supabase
      .from("profiles")
      .select("id, email, first_name, last_name, avatar_url")
      .ilike("email", `%${email}%`)
      .limit(10);

    if (error) throw error;

    res.json({
      success: true,
      data: profiles,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  getProfileById,
  searchProfiles,
};
