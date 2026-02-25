# FlickDo - Modo Preview

## 📋 Descripción

Esta es la versión **preview/demo** de FlickDo que funciona completamente sin base de datos. Todos los datos son ejemplos y los cambios se guardan solo en el navegador durante la sesión actual.

## ✨ Características del Modo Preview

- ✅ No requiere autenticación ni base de datos
- ✅ Usuario simulado automáticamente logueado
- ✅ Datos de ejemplo precargados (listas, tareas, tags)
- ✅ Todas las operaciones CRUD funcionan localmente
- ✅ Modal informativo al inicio de la sesión
- ✅ Cambios persisten solo durante la sesión del navegador

## 🔧 Cómo Funciona

### Archivos Modificados

1. **`client/src/data/mockData.js`**
   - Contiene todos los datos de ejemplo (usuario, listas, tareas, tags)
   - Define estructuras de datos mock para la demostración

2. **`client/src/contexts/AuthContext.jsx`**
   - Variable `IS_PREVIEW_MODE = true` activa el modo preview
   - Usuario simulado se autentica automáticamente
   - No se realizan llamadas al backend de autenticación

3. **`client/src/contexts/TasksContext.jsx`**
   - Variable `IS_PREVIEW_MODE = true` activa el modo preview
   - Todas las operaciones CRUD funcionan sobre datos locales
   - No se realizan llamadas a la API del backend

4. **`client/src/components/PreviewModal.jsx`**
   - Modal que aparece al inicio explicando el modo preview
   - Incluye enlace al repositorio de GitHub
   - Se muestra una sola vez por sesión

5. **`client/src/App.jsx`**
   - Importa y muestra el PreviewModal
   - Resto de la funcionalidad permanece igual

## 🚀 Cambiar a Modo Producción

Para desactivar el modo preview y usar la aplicación con backend y base de datos:

### Paso 1: Desactivar Preview en AuthContext

Edita `client/src/contexts/AuthContext.jsx`:

```javascript
// Cambiar de:
const IS_PREVIEW_MODE = true;

// A:
const IS_PREVIEW_MODE = false;
```

### Paso 2: Desactivar Preview en TasksContext

Edita `client/src/contexts/TasksContext.jsx`:

```javascript
// Cambiar de:
const IS_PREVIEW_MODE = true;

// A:
const IS_PREVIEW_MODE = false;
```

### Paso 3: Opcional - Ocultar Modal de Preview

Para ocultar el modal de preview, edita `client/src/App.jsx` y comenta o elimina:

```javascript
// Comentar esta línea:
// <PreviewModal />
```

### Paso 4: Configurar Variables de Entorno

Asegúrate de tener configuradas las variables de entorno para conectar con el backend:

```env
VITE_API_URL=http://localhost:3000/api
# O tu URL de producción
```

## 📝 Notas Importantes

### Datos del Preview

- **Usuario**: demo@flickdo.com (Demo User)
- **Listas**: 4 listas de ejemplo (Trabajo, Estudios, Personal, Proyectos)
- **Tareas**: 11 tareas distribuidas en las listas
- **Tags**: 10 tags con diferentes colores

### Limitaciones del Preview

- ❌ Los datos no se persisten al recargar la página
- ❌ No hay autenticación real
- ❌ **OAuth deshabilitado**: Los botones de login con Google/GitHub no funcionan en preview
- ❌ Funcionalidades colaborativas no están disponibles
- ❌ No se puede cerrar sesión (siempre aparece como logueado)
- ❌ No hay sincronización entre dispositivos

### ⚠️ Importante sobre OAuth

En modo preview, los botones de autenticación con Google y GitHub están **completamente deshabilitados** para evitar solicitudes de permisos innecesarias. Si ves algún diálogo pidiendo permisos para acceder a otras aplicaciones:

1. **Cierra el diálogo** - No es necesario otorgar ningún permiso
2. **El preview funciona sin autenticación** - Ya estás automáticamente logueado con datos de demostración
3. **Para la versión completa** - Consulta la [documentación de instalación](docs/getting-started/installation.md)

### Personalización

Para cambiar los datos de ejemplo, edita `client/src/data/mockData.js`:

```javascript
export const mockLists = [
  // Agregar, modificar o eliminar listas de ejemplo
];

export const mockUser = {
  // Modificar datos del usuario demo
};
```

## 🔄 URL del Repositorio

El enlace de GitHub en el modal de preview está configurado para:

```jsx
<a
  href="https://github.com/rub3nnn/FlickDo"
  target="_blank"
  rel="noopener noreferrer"
>
  Ver en GitHub
</a>
```

✅ **Ya está configurado correctamente**.

## 🛠️ Desarrollo

### Agregar Nuevos Datos Mock

Si necesitas agregar más datos de ejemplo:

1. Edita `client/src/data/mockData.js`
2. Agrega nuevas listas, tareas o tags siguiendo la estructura existente
3. Los cambios se reflejarán automáticamente al recargar la aplicación

### Mantener Ambas Versiones

Puedes usar una variable de entorno para controlar el modo:

```javascript
// En los archivos de contexto:
const IS_PREVIEW_MODE = import.meta.env.VITE_PREVIEW_MODE === "true";
```

Luego en tu `.env`:

```env
VITE_PREVIEW_MODE=true  # Para preview
# VITE_PREVIEW_MODE=false  # Para producción
```

## 📚 Recursos

- [Documentación Completa](../docs/index.md)
- [Guía de Instalación](../docs/getting-started/installation.md)
- [Arquitectura del Proyecto](../docs/development/architecture.md)

## 🤝 Contribuir

Si encuentras algún problema con el modo preview o tienes sugerencias, no dudes en abrir un issue en el repositorio.

---

**Nota**: Esta configuración de preview es ideal para demostraciones, testing de UI, o para desarrollar sin necesidad de configurar el backend completo.
