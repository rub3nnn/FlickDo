-- Función que se ejecuta cuando se crea un nuevo usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  first_name_value text;
  last_name_value text;
BEGIN
  -- Extraer first_name (puede venir de diferentes campos según el proveedor)
  first_name_value := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'given_name',
    SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1),
    SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 1),
    ''
  );

  -- Extraer last_name (puede venir de diferentes campos según el proveedor)
  last_name_value := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'family_name',
    NULLIF(SUBSTRING(NEW.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1), ''),
    NULLIF(SUBSTRING(NEW.raw_user_meta_data->>'name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'name') + 1), ''),
    ''
  );

  INSERT INTO public.users (id, first_name, last_name, last_update)
  VALUES (
    NEW.id,
    first_name_value,
    last_name_value,
    NOW()
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cuando se crea un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
