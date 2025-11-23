# 📁 Database Documentation

Este directorio contiene la documentación y scripts SQL para la base de datos de FlickDo.

## 📄 Archivos

### `schema_documentation.sql`

Documentación completa del esquema de la base de datos con:

- Definición de todas las tablas
- Relaciones y foreign keys
- Índices recomendados
- Triggers
- Comentarios explicativos

**Nota:** Este archivo es solo para documentación, no está diseñado para ejecutarse directamente.

### `function_get_user_tasks_optimized.sql`

Función de PostgreSQL optimizada para obtener tareas del usuario con listas y tags.

**Características:**

- ✅ Una sola consulta a la base de datos
- ✅ Retorna tasks y lists por separado (sin duplicación)
- ✅ Incluye tags de cada lista automáticamente
- ✅ Reducción del 90% en payload de red
- ✅ Performance optimizada con índices

**Uso:**

```sql
-- Ejecutar en Supabase SQL Editor para crear la función
\i function_get_user_tasks_optimized.sql

-- Luego llamar desde el backend con:
supabase.rpc('get_user_tasks_with_lists', {
  p_user_id: 'uuid-here',
  p_include_completed: false,
  p_parent_id: null
})
```

### `fulldatabase.sql`

Schema original de la base de datos (legacy).

### `rls_policies.sql`

Políticas de Row Level Security (RLS) para Supabase.

### `migration_remove_position_assignee.sql`

Migración histórica que removió campos obsoletos.

## 🚀 Setup Inicial

1. **Crear el schema base** (si es una instalación nueva):

   - Ejecutar las tablas desde `schema_documentation.sql` manualmente o
   - Usar las migraciones de Supabase

2. **Agregar función optimizada**:

   ```sql
   -- Copiar y ejecutar en Supabase SQL Editor
   CREATE OR REPLACE FUNCTION get_user_tasks_with_lists(...)
   ```

3. **Verificar índices**:
   - Los índices recomendados mejoran significativamente el performance
   - Revisar `schema_documentation.sql` para la lista completa

## 📊 Diagrama de Relaciones

```
profiles (1) ----< (N) todo_lists
profiles (1) ----< (N) list_members
profiles (1) ----< (N) tasks
profiles (1) ----< (N) task_assignees

todo_lists (1) ----< (N) list_members
todo_lists (1) ----< (N) list_tags
todo_lists (1) ----< (N) tasks

tasks (1) ----< (N) tasks (self-referential)
tasks (1) ----< (N) task_assignees
tasks (1) ----< (N) task_tags
tasks (1) ---- (1) classroom_integrations

list_tags (1) ----< (N) task_tags
```

## 🔧 Mantenimiento

### Backup

Siempre hacer backup antes de ejecutar migraciones:

```sql
-- Desde Supabase Dashboard > Database > Backups
```

### Performance Monitoring

Revisar queries lentas en Supabase Dashboard > Database > Query Performance

### Índices

Si detectas queries lentas, considera agregar índices específicos:

```sql
CREATE INDEX idx_custom ON table_name(column_name);
```

## 📝 Notas

- **Cascading Deletes**: Configurados en todas las foreign keys
- **Timestamps**: Auto-manejados con triggers
- **JSONB**: Usado para configuración flexible de listas
- **RLS**: Implementado para seguridad a nivel de fila
