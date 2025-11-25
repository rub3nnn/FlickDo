-- ============================================================
-- Migration: Auto-create list_member when a new todo_list is created
-- This trigger automatically adds the owner as a member with 'owner' role
-- ============================================================

-- Function to automatically add owner as list member
CREATE OR REPLACE FUNCTION public.handle_new_list()
RETURNS TRIGGER AS $$
BEGIN
  -- Automatically add the owner as a member with 'owner' role
  INSERT INTO public.list_members (list_id, user_id, role)
  VALUES (NEW.id, NEW.owner_id, 'owner');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires after a new list is created
DROP TRIGGER IF EXISTS on_list_created ON public.todo_lists;
CREATE TRIGGER on_list_created
  AFTER INSERT ON public.todo_lists
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_list();

-- ============================================================
-- NOTA: Ejecuta este script en tu base de datos Supabase
-- Después de aplicar esto, el backend NO necesita crear el 
-- registro list_member manualmente - la base de datos lo hace
-- ============================================================
