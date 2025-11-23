-- Tipo Enum
CREATE TYPE public.list_role AS ENUM ('owner', 'editor', 'viewer');

-- Perfiles (mantiene UUID porque viene de auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger para auto-crear perfil
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  first_name_value text;
  last_name_value text;
BEGIN
  -- Extraer first_name
  first_name_value := COALESCE(
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'given_name',
    SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 1),
    SPLIT_PART(NEW.raw_user_meta_data->>'name', ' ', 1),
    ''
  );

  -- Extraer last_name
  last_name_value := COALESCE(
    NEW.raw_user_meta_data->>'last_name',
    NEW.raw_user_meta_data->>'family_name',
    NULLIF(SUBSTRING(NEW.raw_user_meta_data->>'full_name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'full_name') + 1), ''),
    NULLIF(SUBSTRING(NEW.raw_user_meta_data->>'name' FROM POSITION(' ' IN NEW.raw_user_meta_data->>'name') + 1), ''),
    ''
  );

  INSERT INTO public.profiles (id, email, first_name, last_name, avatar_url, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    first_name_value,
    last_name_value,
    NEW.raw_user_meta_data->>'avatar_url',
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Listas (ahora con BIGSERIAL)
CREATE TABLE public.todo_lists (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  is_archived BOOLEAN DEFAULT false,
  
  configuration JSONB DEFAULT '{
    "type": "standard", 
    "show_dates": true, 
    "enable_assignments": true,
    "restrict_editing_to_assignee": false
  }'::jsonb,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Miembros
CREATE TABLE public.list_members (
  list_id BIGINT REFERENCES public.todo_lists(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role public.list_role DEFAULT 'viewer',
  joined_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (list_id, user_id)
);

-- Etiquetas (ahora con BIGSERIAL)
CREATE TABLE public.tags (
  id BIGSERIAL PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tareas (ahora con BIGSERIAL)
CREATE TABLE public.tasks (
  id BIGSERIAL PRIMARY KEY,
  list_id BIGINT REFERENCES public.todo_lists(id) ON DELETE CASCADE NOT NULL,
  parent_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  
  due_date TIMESTAMPTZ, 
  is_all_day BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Asignados a tareas (múltiples usuarios pueden estar asignados a una tarea)
CREATE TABLE public.task_assignees (
  task_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

-- Relación Tareas-Etiquetas
CREATE TABLE public.task_tags (
  task_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE,
  tag_id BIGINT REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, tag_id)
);

-- Integración Classroom
CREATE TABLE public.classroom_integrations (
  task_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE PRIMARY KEY,
  course_id TEXT NOT NULL,
  course_work_id TEXT NOT NULL,
  alternate_link TEXT,
  last_synced_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 3. HABILITAR RLS (sin políticas, solo backend con service_key)
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.todo_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.list_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_integrations ENABLE ROW LEVEL SECURITY;