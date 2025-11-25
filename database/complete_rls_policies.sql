-- ============================================================
-- POLÍTICAS RLS COMPLETAS PARA FLICKDO
-- ============================================================
-- Importante: Estas políticas asumen que usas service_role key en el backend
-- Si usas anon key desde el cliente, necesitarás ajustar algunas políticas

-- ============================================================
-- 1. PROFILES
-- ============================================================

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for service role" ON public.profiles;

-- SELECT: Los usuarios pueden ver su propio perfil y perfiles de miembros de listas compartidas
CREATE POLICY "Users can view profiles"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = id OR
  id IN (
    SELECT user_id FROM public.list_members
    WHERE list_id IN (
      SELECT list_id FROM public.list_members WHERE user_id = auth.uid()
    )
  )
);

-- INSERT: Permitir insert (usado por el trigger de auth)
CREATE POLICY "Enable insert for authenticated users"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- UPDATE: Los usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- DELETE: Los usuarios pueden eliminar su propio perfil
CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = id);

-- ============================================================
-- 2. TODO_LISTS
-- ============================================================

DROP POLICY IF EXISTS "Users can view lists" ON public.todo_lists;
DROP POLICY IF EXISTS "Users can insert lists" ON public.todo_lists;
DROP POLICY IF EXISTS "Users can update lists" ON public.todo_lists;
DROP POLICY IF EXISTS "Users can delete lists" ON public.todo_lists;

-- SELECT: Los usuarios pueden ver listas que poseen o de las que son miembros
CREATE POLICY "Users can view lists"
ON public.todo_lists
FOR SELECT
USING (
  owner_id = auth.uid() OR
  id IN (
    SELECT list_id FROM public.list_members WHERE user_id = auth.uid()
  )
);

-- INSERT: Los usuarios autenticados pueden crear listas
CREATE POLICY "Users can insert lists"
ON public.todo_lists
FOR INSERT
TO authenticated
WITH CHECK (owner_id = auth.uid());

-- UPDATE: Solo los propietarios pueden actualizar listas
CREATE POLICY "Users can update lists"
ON public.todo_lists
FOR UPDATE
USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- DELETE: Solo los propietarios pueden eliminar listas
CREATE POLICY "Users can delete lists"
ON public.todo_lists
FOR DELETE
USING (owner_id = auth.uid());

-- ============================================================
-- 3. LIST_MEMBERS
-- ============================================================

DROP POLICY IF EXISTS "Users can view list members" ON public.list_members;
DROP POLICY IF EXISTS "Users can insert list members" ON public.list_members;
DROP POLICY IF EXISTS "Users can update list members" ON public.list_members;
DROP POLICY IF EXISTS "Users can delete list members" ON public.list_members;

-- SELECT: Los miembros de una lista pueden ver otros miembros (sin recursión)
CREATE POLICY "Users can view list members"
ON public.list_members
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.todo_lists 
    WHERE todo_lists.id = list_members.list_id 
    AND todo_lists.owner_id = auth.uid()
  ) OR
  user_id = auth.uid()
);

-- INSERT: Los propietarios pueden agregar miembros
CREATE POLICY "Users can insert list members"
ON public.list_members
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.todo_lists 
    WHERE todo_lists.id = list_members.list_id 
    AND todo_lists.owner_id = auth.uid()
  )
);

-- UPDATE: Los propietarios pueden actualizar roles
CREATE POLICY "Users can update list members"
ON public.list_members
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.todo_lists 
    WHERE todo_lists.id = list_members.list_id 
    AND todo_lists.owner_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.todo_lists 
    WHERE todo_lists.id = list_members.list_id 
    AND todo_lists.owner_id = auth.uid()
  )
);

-- DELETE: Los propietarios pueden remover miembros, los miembros pueden salir
CREATE POLICY "Users can delete list members"
ON public.list_members
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.todo_lists 
    WHERE todo_lists.id = list_members.list_id 
    AND todo_lists.owner_id = auth.uid()
  ) OR
  user_id = auth.uid()
);

-- ============================================================
-- 4. LIST_TAGS
-- ============================================================

DROP POLICY IF EXISTS "Users can view list tags" ON public.list_tags;
DROP POLICY IF EXISTS "Users can insert list tags" ON public.list_tags;
DROP POLICY IF EXISTS "Users can update list tags" ON public.list_tags;
DROP POLICY IF EXISTS "Users can delete list tags" ON public.list_tags;

-- SELECT: Los usuarios pueden ver etiquetas de listas a las que tienen acceso
CREATE POLICY "Users can view list tags"
ON public.list_tags
FOR SELECT
USING (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members WHERE user_id = auth.uid()
  )
);

-- INSERT: Los editores pueden crear etiquetas en sus listas
CREATE POLICY "Users can insert list tags"
ON public.list_tags
FOR INSERT
TO authenticated
WITH CHECK (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- UPDATE: Los editores pueden actualizar etiquetas
CREATE POLICY "Users can update list tags"
ON public.list_tags
FOR UPDATE
USING (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
)
WITH CHECK (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- DELETE: Los editores pueden eliminar etiquetas
CREATE POLICY "Users can delete list tags"
ON public.list_tags
FOR DELETE
USING (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- ============================================================
-- 5. TASKS
-- ============================================================

DROP POLICY IF EXISTS "Users can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON public.tasks;

-- SELECT: Los usuarios pueden ver tareas de listas a las que tienen acceso
CREATE POLICY "Users can view tasks"
ON public.tasks
FOR SELECT
USING (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members WHERE user_id = auth.uid()
  )
);

-- INSERT: Los usuarios pueden crear tareas en listas donde tienen permisos de edición
CREATE POLICY "Users can insert tasks"
ON public.tasks
FOR INSERT
TO authenticated
WITH CHECK (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- UPDATE: Los editores/propietarios pueden actualizar tareas
CREATE POLICY "Users can update tasks"
ON public.tasks
FOR UPDATE
USING (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
)
WITH CHECK (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- DELETE: Los editores/propietarios pueden eliminar tareas
CREATE POLICY "Users can delete tasks"
ON public.tasks
FOR DELETE
USING (
  list_id IN (
    SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
  ) OR
  list_id IN (
    SELECT list_id FROM public.list_members 
    WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
  )
);

-- ============================================================
-- 6. TASK_ASSIGNEES
-- ============================================================

DROP POLICY IF EXISTS "Users can view task assignees" ON public.task_assignees;
DROP POLICY IF EXISTS "Users can insert task assignees" ON public.task_assignees;
DROP POLICY IF EXISTS "Users can delete task assignees" ON public.task_assignees;

-- SELECT: Los usuarios pueden ver asignaciones de tareas a las que tienen acceso
CREATE POLICY "Users can view task assignees"
ON public.task_assignees
FOR SELECT
USING (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members WHERE user_id = auth.uid()
    )
  )
);

-- INSERT: Los editores pueden asignar tareas
CREATE POLICY "Users can insert task assignees"
ON public.task_assignees
FOR INSERT
TO authenticated
WITH CHECK (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
);

-- DELETE: Los editores pueden desasignar tareas
CREATE POLICY "Users can delete task assignees"
ON public.task_assignees
FOR DELETE
USING (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
);

-- ============================================================
-- 7. TASK_TAGS
-- ============================================================

DROP POLICY IF EXISTS "Users can view task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can insert task tags" ON public.task_tags;
DROP POLICY IF EXISTS "Users can delete task tags" ON public.task_tags;

-- SELECT: Los usuarios pueden ver tags de tareas a las que tienen acceso
CREATE POLICY "Users can view task tags"
ON public.task_tags
FOR SELECT
USING (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members WHERE user_id = auth.uid()
    )
  )
);

-- INSERT: Los editores pueden agregar tags a tareas
CREATE POLICY "Users can insert task tags"
ON public.task_tags
FOR INSERT
TO authenticated
WITH CHECK (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
);

-- DELETE: Los editores pueden remover tags de tareas
CREATE POLICY "Users can delete task tags"
ON public.task_tags
FOR DELETE
USING (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
);

-- ============================================================
-- 8. CLASSROOM_INTEGRATIONS
-- ============================================================

DROP POLICY IF EXISTS "Users can view classroom integrations" ON public.classroom_integrations;
DROP POLICY IF EXISTS "Users can insert classroom integrations" ON public.classroom_integrations;
DROP POLICY IF EXISTS "Users can update classroom integrations" ON public.classroom_integrations;
DROP POLICY IF EXISTS "Users can delete classroom integrations" ON public.classroom_integrations;

-- SELECT: Los usuarios pueden ver integraciones de sus tareas
CREATE POLICY "Users can view classroom integrations"
ON public.classroom_integrations
FOR SELECT
USING (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members WHERE user_id = auth.uid()
    )
  )
);

-- INSERT: Los editores pueden crear integraciones
CREATE POLICY "Users can insert classroom integrations"
ON public.classroom_integrations
FOR INSERT
TO authenticated
WITH CHECK (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
);

-- UPDATE: Los editores pueden actualizar integraciones
CREATE POLICY "Users can update classroom integrations"
ON public.classroom_integrations
FOR UPDATE
USING (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
)
WITH CHECK (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
);

-- DELETE: Los editores pueden eliminar integraciones
CREATE POLICY "Users can delete classroom integrations"
ON public.classroom_integrations
FOR DELETE
USING (
  task_id IN (
    SELECT t.id FROM public.tasks t
    WHERE t.list_id IN (
      SELECT id FROM public.todo_lists WHERE owner_id = auth.uid()
    ) OR t.list_id IN (
      SELECT list_id FROM public.list_members 
      WHERE user_id = auth.uid() AND role IN ('owner', 'editor')
    )
  )
);

-- ============================================================
-- NOTAS IMPORTANTES
-- ============================================================
-- 1. Si usas service_role key desde el backend, estas políticas se bypasean automáticamente
-- 2. Estas políticas están diseñadas para uso con anon key desde el cliente
-- 3. Las políticas permiten:
--    - Los propietarios tienen acceso completo a sus listas
--    - Los editores pueden crear/modificar/eliminar tareas
--    - Los viewers solo pueden ver
--    - Los usuarios solo ven listas de las que son miembros
-- 4. Para mejor rendimiento, considera crear índices en las columnas usadas en las políticas
