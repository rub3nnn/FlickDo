# 📚 Acceso a la Documentación

## ⚠️ Cambio Importante

GitHub Pages ahora muestra el **preview en vivo de la aplicación FlickDo** en lugar de la documentación.

- 🌐 **Preview de la App**: https://rub3nnn.github.io/FlickDo/
- 📖 **Documentación**: Disponible localmente (ver abajo)

## 📖 Ver la Documentación

### Opción 1: Construcción Local (Recomendado)

```bash
# Instalar MkDocs
pip install mkdocs mkdocs-material pymdown-extensions mkdocs-minify-plugin

# Construir y servir la documentación
mkdocs serve

# Abre tu navegador en: http://127.0.0.1:8000
```

### Opción 2: Construir HTML Estático

```bash
# Construir la documentación
mkdocs build

# Los archivos HTML estarán en ./site/
# Abre site/index.html en tu navegador
```

### Opción 3: Leer Markdown Directamente

Los archivos de documentación están en la carpeta `docs/`:

```
docs/
├── index.md
├── getting-started/
│   ├── installation.md
│   ├── introduction.md
│   └── quick-start.md
├── development/
│   ├── architecture.md
│   ├── backend.md
│   ├── frontend.md
│   ├── database.md
│   └── contributing.md
├── deployment/
│   ├── frontend.md
│   ├── backend.md
│   ├── database.md
│   └── environment.md
├── api/
│   ├── overview.md
│   ├── authentication.md
│   ├── tasks.md
│   ├── lists.md
│   ├── tags.md
│   └── users.md
└── user-guide/
    ├── tasks.md
    ├── lists.md
    ├── tags.md
    ├── calendar.md
    ├── classroom.md
    ├── statistics.md
    └── collaboration.md
```

## 🔄 ¿Por qué el cambio?

- ✅ GitHub Pages gratuito permite un solo sitio por repositorio
- ✅ El preview en vivo es más útil para demostrar la funcionalidad
- ✅ La documentación se mantiene actualizada y accesible en el repositorio
- ✅ MkDocs ofrece mejor experiencia de desarrollo local

## 🌐 Opciones para Publicar Documentación

Si deseas publicar la documentación en línea:

### 1. ReadTheDocs (Recomendado - Gratis)

1. Registrate en https://readthedocs.org/
2. Conecta tu repositorio de GitHub
3. Configura el build con MkDocs
4. Tu documentación estará en: `https://flickdo.readthedocs.io/`

### 2. Netlify (Alternativa)

```bash
# Crear netlify.toml en la raíz
[build]
  command = "pip install mkdocs mkdocs-material pymdown-extensions mkdocs-minify-plugin && mkdocs build"
  publish = "site"
```

Luego conecta tu repo en https://netlify.com/

### 3. Vercel (Alternativa)

```bash
# Crear vercel.json en la raíz
{
  "buildCommand": "pip install mkdocs mkdocs-material pymdown-extensions mkdocs-minify-plugin && mkdocs build",
  "outputDirectory": "site"
}
```

### 4. GitHub Pages en Subdirectorio

Podrías servir tanto la app como los docs desde diferentes paths, pero requiere configuración más compleja.

## 📝 Workflow de Documentación

El workflow `.github/workflows/docs.yml` ahora **solo construye** la documentación para validar que esté correcta, pero **no la despliega**.

- ✅ Verifica que la documentación se construya sin errores
- ✅ Se ejecuta en push a ramas de documentación
- ❌ No despliega a GitHub Pages

## 🔗 Enlaces Útiles

- **App Preview**: https://rub3nnn.github.io/FlickDo/
- **Repositorio**: https://github.com/rub3nnn/FlickDo
- **Issues**: https://github.com/rub3nnn/FlickDo/issues
- **MkDocs**: https://www.mkdocs.org/
- **ReadTheDocs**: https://readthedocs.org/

---

**Resumen**: La documentación sigue disponible en el repositorio y se puede consultar localmente. GitHub Pages ahora muestra el preview funcional de la aplicación.
