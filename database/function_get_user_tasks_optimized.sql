-- ============================================
-- Función optimizada para obtener tareas del usuario
-- con listas y tags en una sola consulta
-- ============================================

CREATE OR REPLACE FUNCTION get_user_tasks_with_lists(
  p_user_id UUID,
  p_include_completed BOOLEAN DEFAULT true,
  p_parent_id BIGINT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Consulta optimizada que devuelve tasks y lists por separado
  SELECT jsonb_build_object(
    'tasks', (
      SELECT COALESCE(jsonb_agg(task_data), '[]'::jsonb)
      FROM (
        SELECT 
          t.id,
          t.list_id,
          t.parent_id,
          t.title,
          t.description,
          t.is_completed,
          t.due_date,
          t.is_all_day,
          t.created_at,
          t.updated_at,
          t.created_by,
          -- Assignees como JSON array
          (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
              'id', p.id,
              'email', p.email,
              'first_name', p.first_name,
              'last_name', p.last_name,
              'avatar_url', p.avatar_url
            )), '[]'::jsonb)
            FROM task_assignees ta
            JOIN profiles p ON p.id = ta.user_id
            WHERE ta.task_id = t.id
          ) as assignees,
          -- Tags como JSON array
          (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
              'id', lt.id,
              'name', lt.name,
              'color', lt.color
            )), '[]'::jsonb)
            FROM task_tags tt
            JOIN list_tags lt ON lt.id = tt.tag_id
            WHERE tt.task_id = t.id
          ) as tags,
          -- Classroom integration como objeto o null
          (
            SELECT jsonb_build_object(
              'course_id', ci.course_id,
              'course_work_id', ci.course_work_id,
              'alternate_link', ci.alternate_link,
              'last_synced_at', ci.last_synced_at
            )
            FROM classroom_integrations ci
            WHERE ci.task_id = t.id
          ) as classroom_integration
        FROM tasks t
        INNER JOIN todo_lists tl ON tl.id = t.list_id
        INNER JOIN list_members lm ON lm.list_id = tl.id
        WHERE lm.user_id = p_user_id
          AND tl.is_archived = false
          AND (p_include_completed OR t.is_completed = false)
          AND (
            (p_parent_id IS NULL AND t.parent_id IS NULL) OR
            (p_parent_id IS NOT NULL AND t.parent_id = p_parent_id)
          )
        ORDER BY t.list_id, t.created_at
      ) task_data
    ),
    'lists', (
      SELECT COALESCE(jsonb_agg(list_data), '[]'::jsonb)
      FROM (
        SELECT DISTINCT
          tl.id,
          tl.title,
          tl.configuration,
          lm.role,
          -- Tags de la lista como JSON array
          (
            SELECT COALESCE(jsonb_agg(jsonb_build_object(
              'id', lt.id,
              'name', lt.name,
              'color', lt.color,
              'created_at', lt.created_at
            ) ORDER BY lt.name), '[]'::jsonb)
            FROM list_tags lt
            WHERE lt.list_id = tl.id
          ) as tags
        FROM todo_lists tl
        INNER JOIN list_members lm ON lm.list_id = tl.id
        WHERE lm.user_id = p_user_id
          AND tl.is_archived = false
          -- Solo listas que tienen tareas (opcional: remover para incluir listas vacías)
          AND EXISTS (
            SELECT 1 FROM tasks t 
            WHERE t.list_id = tl.id
              AND (p_include_completed OR t.is_completed = false)
              AND (
                (p_parent_id IS NULL AND t.parent_id IS NULL) OR
                (p_parent_id IS NOT NULL AND t.parent_id = p_parent_id)
              )
          )
        ORDER BY tl.id
      ) list_data
    ),
    'metadata', jsonb_build_object(
      'user_id', p_user_id,
      'timestamp', now(),
      'filters', jsonb_build_object(
        'include_completed', p_include_completed,
        'parent_id', p_parent_id
      )
    )
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Ejemplo de uso
-- ============================================

/*
-- Llamar la función desde SQL:
SELECT get_user_tasks_with_lists(
  'user-uuid-here'::UUID,
  false,  -- no incluir completadas
  NULL    -- solo tareas principales (sin parent)
);

-- Resultado esperado:
{
  "tasks": [
    {
      "id": 1,
      "list_id": 10,
      "title": "Mi tarea",
      "assignees": [...],
      "tags": [...],
      "classroom_integration": {...}
    }
  ],
  "lists": [
    {
      "id": 10,
      "title": "Mi Lista",
      "role": "owner",
      "configuration": {...},
      "tags": [
        {"id": 1, "name": "Urgente", "color": "#FF0000"},
        {"id": 2, "name": "Personal", "color": "#00FF00"}
      ]
    }
  ],
  "metadata": {
    "user_id": "...",
    "timestamp": "2025-11-23...",
    "filters": {...}
  }
}
*/

-- ============================================
-- Índices recomendados para optimización
-- ============================================

-- Ya deberían existir, pero por si acaso:
CREATE INDEX IF NOT EXISTS idx_tasks_list_id_completed ON tasks(list_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_list_members_user_list ON list_members(user_id, list_id);
CREATE INDEX IF NOT EXISTS idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignees_task_id ON task_assignees(task_id);
