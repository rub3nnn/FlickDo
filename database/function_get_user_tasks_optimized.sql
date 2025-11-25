-- ============================================
-- Función optimizada para obtener LISTAS del usuario
-- con sus tareas incluidas en una sola consulta
-- 
-- ENFOQUE: Listas primero, tareas dentro de cada lista
-- Así las listas vacías también se devuelven
-- 
-- NOTA: Usa to_jsonb() para obtener TODOS los campos automáticamente
-- Si añades nuevos campos a las tablas, aparecerán sin modificar esta función
-- ============================================

CREATE OR REPLACE FUNCTION get_user_lists_with_tasks(
  p_user_id UUID,
  p_include_completed BOOLEAN DEFAULT true,
  p_include_archived BOOLEAN DEFAULT false
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'lists', (
      SELECT COALESCE(jsonb_agg(
        -- Todos los campos de todo_lists + campos calculados
        to_jsonb(tl.*) || jsonb_build_object(
          'role', lm.role,
          'is_shared', (SELECT COUNT(*) > 1 FROM list_members WHERE list_id = tl.id),
          'tags', (
            SELECT COALESCE(jsonb_agg(to_jsonb(lt.*) ORDER BY lt.name), '[]'::jsonb)
            FROM list_tags lt
            WHERE lt.list_id = tl.id
          ),
          'tasks', (
            SELECT COALESCE(jsonb_agg(
              -- Todos los campos de tasks + campos calculados
              to_jsonb(t.*) || jsonb_build_object(
                'assignees', (
                  SELECT COALESCE(jsonb_agg(to_jsonb(p.*)), '[]'::jsonb)
                  FROM task_assignees ta
                  JOIN profiles p ON p.id = ta.user_id
                  WHERE ta.task_id = t.id
                ),
                'tags', (
                  SELECT COALESCE(jsonb_agg(to_jsonb(lt2.*)), '[]'::jsonb)
                  FROM task_tags tt
                  JOIN list_tags lt2 ON lt2.id = tt.tag_id
                  WHERE tt.task_id = t.id
                ),
                'classroom_integration', (
                  SELECT to_jsonb(ci.*)
                  FROM classroom_integrations ci
                  WHERE ci.task_id = t.id
                )
              ) ORDER BY t.created_at
            ), '[]'::jsonb)
            FROM tasks t
            WHERE t.list_id = tl.id
              AND t.parent_id IS NULL
              AND (p_include_completed OR t.is_completed = false)
          )
        ) ORDER BY tl.created_at DESC
      ), '[]'::jsonb)
      FROM todo_lists tl
      INNER JOIN list_members lm ON lm.list_id = tl.id
      WHERE lm.user_id = p_user_id
        AND (p_include_archived OR tl.is_archived = false)
    ),
    'metadata', jsonb_build_object(
      'user_id', p_user_id,
      'timestamp', now(),
      'filters', jsonb_build_object(
        'include_completed', p_include_completed,
        'include_archived', p_include_archived
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
SELECT get_user_lists_with_tasks(
  'user-uuid-here'::UUID,
  true,   -- incluir tareas completadas
  false   -- no incluir listas archivadas
);

-- Resultado esperado:
{
  "lists": [
    {
      "id": 10,
      "title": "Mi Lista",
      "owner_id": "uuid...",
      "role": "owner",
      "is_shared": false,
      "configuration": {...},
      "tags": [
        {"id": 1, "name": "Urgente", "color": "#FF0000"}
      ],
      "tasks": [
        {
          "id": 1,
          "list_id": 10,
          "title": "Mi tarea",
          "is_completed": false,
          "assignees": [...],
          "tags": [...],
          "classroom_integration": null
        }
      ]
    },
    {
      "id": 11,
      "title": "Lista Vacía",
      "tasks": []  <-- Lista vacía también aparece
    }
  ],
  "metadata": {
    "user_id": "...",
    "timestamp": "2025-11-25...",
    "filters": {...}
  }
}
*/

-- ============================================
-- Índices recomendados para optimización
-- ============================================

CREATE INDEX IF NOT EXISTS idx_tasks_list_id_parent ON tasks(list_id, parent_id);
CREATE INDEX IF NOT EXISTS idx_tasks_list_id_completed ON tasks(list_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_list_members_user_list ON list_members(user_id, list_id);
CREATE INDEX IF NOT EXISTS idx_task_tags_task_id ON task_tags(task_id);
CREATE INDEX IF NOT EXISTS idx_task_assignees_task_id ON task_assignees(task_id);
CREATE INDEX IF NOT EXISTS idx_list_tags_list_id ON list_tags(list_id);
