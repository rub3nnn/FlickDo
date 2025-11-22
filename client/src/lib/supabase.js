// src/lib/supabase.js
// NOTA: Este archivo ya NO se usa en el frontend
// Toda la lógica de autenticación se maneja a través del backend
// Se mantiene este archivo por si acaso se necesita en el futuro

/*
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});
*/
