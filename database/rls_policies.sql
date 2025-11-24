-- ============================================================
-- POLÍTICAS RLS PARA PROFILES
-- ============================================================
-- Estas políticas permiten que el backend con service_role key
-- pueda acceder a los perfiles sin restricciones

-- Política: Los usuarios pueden ver su propio perfil
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Política: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Política: Permitir INSERT desde el trigger (service_role bypass automático)
CREATE POLICY "Enable insert for service role"
ON public.profiles
FOR INSERT
WITH CHECK (true);

-- NOTA: El service_role key bypass automáticamente todas las políticas RLS
-- Estas políticas son para cuando uses el anon key desde el cliente
