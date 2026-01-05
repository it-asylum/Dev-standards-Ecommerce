# Shopify Theme + Git — Guía técnica (paso a paso)

> Esta guía documenta un flujo **seguro y productivo** para desarrollar un tema de Shopify con **Shopify CLI + Git**. Incluye entornos, scripts, buenas prácticas y solución de problemas.

## Requisitos

- **Node.js** LTS (v18+ recomendado).
- **Shopify CLI** para temas:
  ```bash
  npm i -g @shopify/cli @shopify/theme
  ```
- **Git** instalado y acceso a tu **organización de GitHub** (o repo personal).
- Permisos en la tienda para **ver/editar Temas**.

> **Notas de CLI (v3.x)**
> - `shopify auth login` inicia sesión sin `--store`.
> - Los comandos de **theme** aceptan `--store=<tienda>.myshopify.com`.
> - `whoami` puede no existir según versión.
> - Si el CLI intenta autocorregir a “Hydrogen”, desactiva autocorrección:
>   ```bash
>   shopify config autocorrect off
>   ```

---

## Nomenclatura usada en ejemplos

- `<store>` → **subdominio** de la tienda (sin https), p. ej. `the-beauty-corner-col`.
- `<theme_id_dev>` / `<theme_id_prod>` → IDs numéricos de temas.
- **Entornos**:
  - `beauty-dev` → tema de **desarrollo** (no publicado).
  - `beauty-prod` → tema **publicado** (producción).

---

## Paso a paso

### Paso 0 — (opcional) Instalación / verificación
```bash
npm i -g @shopify/cli @shopify/theme
shopify version
```

### Paso 1 — Autenticación
```bash
shopify auth login
```
Se abrirá el navegador; inicia sesión con tu cuenta.

### Paso 2 — Listar temas de la tienda
```bash
shopify theme list --store=<store>.myshopify.com
```
Identifica el **ID** del tema que vas a descargar (**no trabajes sobre el LIVE**).

### Paso 3 — Descargar el tema (pull)
```bash
shopify theme pull --store=<store>.myshopify.com --theme <theme_id_dev-o-el-que-vayas-a-usar>
```
Esto trae todos los archivos a tu carpeta local.

### Paso 4 — Archivos base del proyecto

Crea estos archivos en la raíz del proyecto:

**`.gitignore`**
```gitignore
# Node / tooling
node_modules/
dist/
.cache/
.tmp/

# OS / editors
.DS_Store
Thumbs.db
.vscode/
.idea/

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
```

**`.shopifyignore`** (usa globs para evitar warnings del CLI)
```gitignore
# Evitar subir basura al tema remoto
node_modules/**
dist/**
scripts/**
test/**
coverage/**
tmp/**
.cache/**
.tmp/**

# Map/locks
*.map
*.lock

# Archivos locales que no deben vivir en el tema
README.md
package-lock.json
pnpm-lock.yaml
yarn.lock

# OS / editores
.DS_Store
Thumbs.db
.vscode/**
.idea/**
```

**`shopify.theme.toml`** (entornos)
```toml
# Configurar entornos para no repetir flags en cada comando

[environments.beauty-dev]
store = "<store>"
theme = "<theme_id_dev>"       # usa un tema NO publicado (duplicado del live)

[environments.beauty-prod]
store = "<store>"
theme = "<theme_id_prod>"      # ID del tema publicado (producción)
```

> **Sugerido:** si aún no tienes un tema DEV, **duplica el LIVE** y usa ese duplicado como entorno de desarrollo:
> ```bash
> shopify theme duplicate --store=<store>.myshopify.com --theme <theme_id_live> --name "Tema - DEV (CLI)"
> shopify theme list --store=<store>.myshopify.com   # copia el nuevo ID
> ```

**`package.json`** (scripts útiles)
```json
{
  "name": "shopify-theme",
  "private": true,
  "scripts": {
    "dev": "shopify theme dev -e beauty-dev",
    "pull": "shopify theme pull -e beauty-dev",
    "push:dev": "shopify theme push -e beauty-dev --only-changed",
    "push:prod": "shopify theme push -e beauty-prod --only-changed",
    "check": "shopify theme check"
  }
}
```

**`README.md`** (corto de flujo para el repo)
```md
# Flujo
1) shopify auth login
2) shopify theme list --store=<store>.myshopify.com
3) shopify theme pull --store=<store>.myshopify.com --theme <ID>
4) npm run dev  # (entorno beauty-dev)
5) Desarrollo local, commits y PRs
6) npm run push:dev  # subir cambios a DEV
7) npm run push:prod # cuando esté aprobado
```

### Paso 5 — Inicializar repo y publicarlo en Git
```bash
git init
git add .
git commit -m "chore: initial snapshot + project scaffolding"

# Repo en la organización (recomendado)
git remote add origin git@github.com:ORGANIZACION/nombre-repo.git
git branch -M main
git push -u origin main
```
> **Protege ramas** en GitHub: regla para `main` (reviews, status checks), y usa `develop` para staging.

### Paso 6 — Desarrollo local
```bash
npm run dev
```
- El CLI sube una versión para **preview** del tema del entorno `beauty-dev`.
- Si la tienda tiene **Storefront Password**, te lo pedirá (está en *Online store → Preferences → Password protection*).

### Paso 7 — Desarrollar
- Edita archivos localmente; el **hot reload** reflejará cambios.
- Pasa checks:
  ```bash
  npm run check
  ```
- Sube cambios al tema **DEV** (no publicado):
  ```bash
  npm run push:dev
  ```
- Cuando esté aprobado, despliega a **PROD**:
  ```bash
  npm run push:prod
  ```

---

## Buenas prácticas

- **Nunca** trabajes sobre el tema **LIVE** directamente.
- Mantén **2 temas**: `DEV/Staging` (no publicado) y `PROD` (publicado).
- Antes de empezar el día: `npm run pull` (por si alguien tocó el tema en el admin).
- Evita editar en el **Theme Editor** mientras desarrollas local (evita *drift*).
- Usa ramas: `feature/<tarea>` → PR a `develop` → QA en DEV → PR a `main` → push a PROD.
- Mensajes de commit claros: prefijos como `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`.
- No subas secretos/tokens en el repo.
- Revisa **Performance** e incluye `theme-check` en tu CI más adelante.

---

## Comandos útiles

```bash
# Info del entorno
shopify theme info -e beauty-dev

# Listar temas de la tienda
shopify theme list --store=<store>.myshopify.com

# Abrir preview del tema activo en dev
shopify theme open -e beauty-dev

# Empaquetar .zip del tema
shopify theme package

# Publicar un tema remoto como live (¡cuidado!)
shopify theme publish --store=<store>.myshopify.com --theme <theme_id_prod>
```

---

## Solución de problemas

- **Me pide “Store password” en `theme dev`:** es la contraseña de **Storefront** (Password protection), no tu pass de admin. Quita la protección o ingrésala cuando la pida.
- **El CLI sugiere `hydrogen login`:** desactiva autocorrección:
  ```bash
  shopify config autocorrect off
  ```
- **Advertencias “Directory pattern may be misleading”:** usa globs `folder/**` en `.shopifyignore` (ver ejemplo arriba).
- **Conflictos entre equipo/Editor:** ejecuta `npm run pull` antes de empezar; coordina no editar desde el Editor mientras hay dev local.
- **No quiero fijar un ID de tema en DEV:** elimina `theme = ...` en `[environments.beauty-dev]`. `shopify theme dev` creará un **Development theme temporal** y no tocará LIVE ni DEV fijos.

---

## Anexo: Multi-tienda (8 ecommerce)

Replica entornos en `shopify.theme.toml`:
```toml
[environments.tiendaA-dev]
store = "tienda-a"
theme = "<id_dev>"

[environments.tiendaA-prod]
store = "tienda-a"
theme = "<id_prod>"

[environments.tiendaB-dev]
store = "tienda-b"
theme = "<id_dev>"
# ...
```

Y añade scripts en `package.json`:
```json
{
  "scripts": {
    "dev:a": "shopify theme dev -e tiendaA-dev",
    "push:a": "shopify theme push -e tiendaA-dev --only-changed",
    "dev:b": "shopify theme dev -e tiendaB-dev",
    "push:b": "shopify theme push -e tiendaB-dev --only-changed"
  }
}
```

---

### Versión del tooling (referencia)
- Shopify CLI 3.x
- Node 18/20 LTS
- Git 2.4x+
