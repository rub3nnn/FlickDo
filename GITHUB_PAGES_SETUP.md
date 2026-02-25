# Configuración de GitHub Pages para FlickDo Preview

## 📋 Guía de Configuración

Esta guía te ayudará a desplegar automáticamente la versión preview de FlickDo en GitHub Pages.

## 🚀 Pasos para Habilitar GitHub Pages

### 1️⃣ Configurar GitHub Pages en el Repositorio

1. Ve a tu repositorio en GitHub
2. Navega a **Settings** (Configuración)
3. En el menú lateral, busca **Pages**
4. En **Source** (Fuente), selecciona:
   - **GitHub Actions** (no "Deploy from a branch")

![GitHub Pages Configuration](https://docs.github.com/assets/cb-47267/mw-1440/images/help/pages/publishing-source-drop-down.webp)

### 2️⃣ Verificar el Nombre del Repositorio

El workflow está configurado para el repositorio `rub3nnn/FlickDo` con base URL `/FlickDo/`.

✅ **Ya está configurado correctamente** para tu repositorio.

Si cambias el nombre del repositorio, edita `client/vite.config.ts`:

```typescript
base: mode === 'production' ? '/NUEVO-NOMBRE-REPO/' : '/',
```

**Opción B: Usar Variable de Entorno en el Workflow**

Edita `.github/workflows/preview-deploy.yml`:

```yaml
- name: Build application
  working-directory: ./client
  run: npm run build
  env:
    VITE_BASE_URL: "/${{ github.event.repository.name }}/"
```

Y en `vite.config.ts`:

```typescript
base: process.env.VITE_BASE_URL || '/',
```

### 3️⃣ Hacer Push a la Rama

```bash
# Asegúrate de estar en la rama correcta
git checkout production/preview

# Haz commit de tus cambios
git add .
git commit -m "Configure GitHub Pages deployment"

# Push a GitHub
git push origin production/preview
```

### 4️⃣ Verificar el Deployment

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás el workflow "Deploy Preview to GitHub Pages" ejecutándose
3. Una vez completado (✅), ve a la pestaña **Settings > Pages**
4. Verás la URL de tu sitio: `https://TU-USUARIO.github.io/FlickDo/`

## 🔧 Configuración del Workflow

El workflow (`.github/workflows/preview-deploy.yml`) se activa automáticamente cuando:

- ✅ Haces push a la rama `production/preview`
- ✅ Lo ejecutas manualmente desde la pestaña Actions

### Características del Workflow

```yaml
- Instala Node.js 20
- Instala dependencias con npm ci
- Compila la aplicación con npm run build
- Sube el contenido de ./client/dist a GitHub Pages
- Despliega automáticamente
```

## 🌐 URLs Resultantes

Después del despliegue, tu preview estará disponible en:

- **Tu sitio**: `https://rub3nnn.github.io/FlickDo/`
- **Repositorio**: `https://github.com/rub3nnn/FlickDo`
- **Actions**: `https://github.com/rub3nnn/FlickDo/actions`
- **Dominio Personalizado**: Configurable en Settings > Pages > Custom domain

## 🔄 Actualizar el Preview

Simplemente haz push a `production/preview` y el workflow se ejecutará automáticamente:

```bash
git checkout production/preview
# Haz tus cambios...
git add .
git commit -m "Update preview"
git push origin production/preview
```

## ⚙️ Configuración Avanzada

### Usar un Dominio Personalizado

1. Ve a **Settings > Pages > Custom domain**
2. Ingresa tu dominio (ej: `preview.midominio.com`)
3. Crea un registro CNAME en tu proveedor DNS apuntando a `TU-USUARIO.github.io`
4. GitHub verificará automáticamente el dominio

Si usas dominio personalizado, actualiza `vite.config.ts`:

```typescript
base: mode === 'production' ? '/' : '/',
```

### Ejecutar Manualmente el Workflow

1. Ve a **Actions** en GitHub
2. Selecciona "Deploy Preview to GitHub Pages"
3. Click en **Run workflow**
4. Elige la rama `production/preview`
5. Click en **Run workflow** verde

## 🐛 Solución de Problemas

### Error: "Page build failed"

**Solución**: Verifica que seleccionaste "GitHub Actions" como source, no "Deploy from a branch"

### Error 404 en rutas

**Solución**: Ya está configurado. El proyecto incluye:

- ✅ `client/public/404.html` - Maneja las rutas de React Router
- ✅ Script en `client/index.html` - Restaura la ruta correcta
- ✅ `.nojekyll` - Evita procesamiento de Jekyll

Estos archivos permiten que las rutas de React Router funcionen correctamente en GitHub Pages.

### CSS o Assets no cargan

**Problema**: La base URL no está configurada correctamente.

**Solución**: Verifica que el `base` en `vite.config.ts` coincida con el nombre de tu repositorio:

```typescript
base: '/NOMBRE-EXACTO-DEL-REPO/',
```

### El workflow no se ejecuta

**Verificar**:

1. Que estés en la rama `production/preview`
2. Que el archivo `.github/workflows/preview-deploy.yml` exista
3. Que GitHub Actions esté habilitado en Settings > Actions > General

## 📊 Monitorear Deployments

Puedes ver todos tus deployments en:

- **Actions Tab**: Histórico de ejecuciones
- **Environments**: Muestra el estado actual de `github-pages`
- **Settings > Pages**: URL y estado del sitio

## 🔐 Permisos Necesarios

El workflow necesita estos permisos (ya configurados):

```yaml
permissions:
  contents: read # Leer el código
  pages: write # Escribir en GitHub Pages
  id-token: write # Token de autenticación
```

## ✅ Checklist de Configuración

- [ ] GitHub Pages configurado en "GitHub Actions"
- [ ] Nombre del repo correcto en `vite.config.ts`
- [ ] Workflow existe en `.github/workflows/preview-deploy.yml`
- [ ] Push realizado a `production/preview`
- [ ] Workflow ejecutado exitosamente
- [ ] Sitio accesible en la URL de GitHub Pages

## 📚 Recursos Adicionales

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)

---

**Nota**: El modo preview no requiere backend, por lo que GitHub Pages es perfecto para demostraciones.
