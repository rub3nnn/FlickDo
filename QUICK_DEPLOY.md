# 🚀 Guía Rápida: Desplegar a GitHub Pages

## Checklist de Configuración

### ✅ Archivos Configurados

Los siguientes archivos ya están configurados para GitHub Pages:

- ✅ `.github/workflows/preview-deploy.yml` - Workflow de deployment
- ✅ `client/vite.config.ts` - Base URL configurada para `/FlickDo/`
- ✅ `client/public/404.html` - Manejo de rutas React Router
- ✅ `client/public/.nojekyll` - Desactiva Jekyll
- ✅ `client/index.html` - Script de restauración de rutas
- ✅ Modal con enlace a `https://github.com/rub3nnn/FlickDo`

### 📝 Pasos para Desplegar

#### 1. Configurar GitHub Pages (Solo una vez)

1. Ve a https://github.com/rub3nnn/FlickDo
2. **Settings** → **Pages**
3. En **Source**, selecciona: **GitHub Actions**

#### 2. Hacer Deploy

```bash
# Asegúrate de estar en la rama correcta
git checkout production/preview

# Haz commit de todos los cambios
git add .
git commit -m "Setup GitHub Pages deployment"

# Push a GitHub - esto activará el workflow
git push origin production/preview
```

#### 3. Esperar el Deployment

1. Ve a https://github.com/rub3nnn/FlickDo/actions
2. Espera a que el workflow "Deploy Preview to GitHub Pages" termine ✅
3. Tu sitio estará en: `https://rub3nnn.github.io/FlickDo/`

## 🔄 Actualizaciones Futuras

Cada vez que hagas push a `production/preview`, el sitio se actualizará automáticamente:

```bash
git checkout production/preview
# Haz cambios...
git add .
git commit -m "Update preview"
git push origin production/preview
```

## 🆘 Problemas Comunes

### El sitio muestra 404

- Verifica que seleccionaste "GitHub Actions" como source
- Espera unos minutos después del primer deployment

### CSS no carga

- Verifica que el `base` en `vite.config.ts` coincida con el nombre del repo

### El workflow no se ejecuta

- Verifica que estés en la rama `production/preview`
- Verifica que GitHub Actions esté habilitado en Settings

## 📚 Documentación Completa

Para más detalles, consulta:

- [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) - Guía completa paso a paso
- [PREVIEW_MODE.md](PREVIEW_MODE.md) - Información sobre el modo preview

## 🎯 URLs Finales

Después del deployment:

- **Preview**: `https://rub3nnn.github.io/FlickDo/`
- **Repositorio**: `https://github.com/rub3nnn/FlickDo`
- **Workflow**: `https://github.com/rub3nnn/FlickDo/actions`

---

**¡Listo!** Tu preview está configurado para desplegarse automáticamente. 🎉
