const { supabase } = require("../config/supabase");
const bcrypt = require("bcryptjs");

// Actualizar perfil del usuario
// PUT /api/users/profile
const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, preferences } = req.body;
    const userId = req.user.id;

    // Actualizar en la tabla profiles
    const { data, error } = await supabase
      .from("profiles")
      .update({
        first_name: firstName,
        last_name: lastName,
        preferences: preferences,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return res.status(400).json({
        success: false,
        message: "Error al actualizar el perfil",
        error: error.message,
      });
    }

    res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      data: {
        profile: data,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Cambiar contraseña
// PUT /api/users/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Obtener el usuario de Supabase Auth para verificar la contraseña actual
    const { data: authUser, error: getUserError } =
      await supabase.auth.admin.getUserById(userId);

    if (getUserError || !authUser) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Verificar la contraseña actual
    // Nota: Supabase no permite verificar contraseñas directamente por seguridad
    // Intentamos hacer login con las credenciales actuales
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: authUser.user.email,
      password: currentPassword,
    });

    if (signInError) {
      return res.status(401).json({
        success: false,
        message: "La contraseña actual es incorrecta",
      });
    }

    // Actualizar la contraseña en Supabase Auth
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      { password: newPassword }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      return res.status(400).json({
        success: false,
        message: "Error al cambiar la contraseña",
        error: updateError.message,
      });
    }

    res.json({
      success: true,
      message: "Contraseña cambiada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar cuenta
// DELETE /api/users/account
const deleteAccount = async (req, res, next) => {
  try {
    const { confirmationPhrase } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Frase de confirmación esperada
    const expectedPhrase = `DELETE MY ACCOUNT PERMANENTLY - ${userEmail}`;

    if (confirmationPhrase !== expectedPhrase) {
      return res.status(400).json({
        success: false,
        message: "La frase de confirmación no coincide",
        expectedPhrase,
      });
    }

    // Eliminar usuario de la tabla profiles (se eliminará en cascada gracias a las foreign keys)
    const { error: deleteProfileError } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (deleteProfileError) {
      console.error("Error deleting profile:", deleteProfileError);
      return res.status(400).json({
        success: false,
        message: "Error al eliminar el perfil",
        error: deleteProfileError.message,
      });
    }

    // Eliminar usuario de Supabase Auth
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(
      userId
    );

    if (deleteAuthError) {
      console.error("Error deleting auth user:", deleteAuthError);
      // Continuar aunque falle, ya que el perfil ya está eliminado
    }

    res.json({
      success: true,
      message: "Cuenta eliminada permanentemente",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  changePassword,
  deleteAccount,
};
