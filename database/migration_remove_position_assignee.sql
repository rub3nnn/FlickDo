-- ============================================================
-- MIGRACIÓN: Remover columnas position y assignee_id de tasks
-- Crear tabla task_assignees para múltiples asignados
-- ============================================================

-- 1. Crear la tabla task_assignees
CREATE TABLE IF NOT EXISTS public.task_assignees (
  task_id BIGINT REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (task_id, user_id)
);

-- 2. Migrar datos de assignee_id a task_assignees
INSERT INTO public.task_assignees (task_id, user_id, assigned_at)
SELECT id, assignee_id, created_at
FROM public.tasks
WHERE assignee_id IS NOT NULL;

-- 3. Eliminar la columna assignee_id
ALTER TABLE public.tasks DROP COLUMN IF EXISTS assignee_id;

-- 4. Eliminar la columna position
ALTER TABLE public.tasks DROP COLUMN IF EXISTS position;

-- 5. Habilitar RLS en task_assignees
ALTER TABLE public.task_assignees ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- VERIFICACIÓN (Opcional - Comentar después de verificar)
-- ============================================================

-- Verificar que las tareas se migraron correctamente
-- SELECT 
--   t.id,
--   t.title,
--   ta.user_id,
--   p.first_name,
--   p.last_name
-- FROM tasks t
-- LEFT JOIN task_assignees ta ON t.id = ta.task_id
-- LEFT JOIN profiles p ON ta.user_id = p.id
-- ORDER BY t.id;
