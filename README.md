# Matri Vale & Nini

Sitio estático de la invitación, preparado para publicarse en GitHub Pages.

## Estructura

- `src/`: HTML, CSS, JavaScript e imágenes originales.
- `scripts/build.py`: genera las imágenes optimizadas y la versión publicable.
- `dist/`: resultado del build. Se genera localmente y no se versiona.
- `.github/workflows/deploy-pages.yml`: build y deploy automático a GitHub Pages.

## Generar `dist/` localmente

Requisitos:

- Python 3.12 o posterior.
- `pip`.

Desde la raíz del repositorio:

```bash
python -m pip install -r requirements.txt
python scripts/build.py
```

El script:

1. Elimina el `dist/` anterior.
2. Copia HTML, CSS y JavaScript desde `src/`.
3. Convierte las imágenes originales a WebP.
4. Genera variantes para móvil y escritorio donde corresponde.
5. Crea `dist/.nojekyll`.

Para revisar el resultado localmente:

```bash
python -m http.server 8000 --directory dist
```

Luego visita <http://localhost:8000>.

## Deploy en GitHub Pages

Cada push a la rama `main` ejecuta el workflow `Deploy to GitHub Pages`:

1. Descarga el repositorio.
2. Configura Python e instala Pillow.
3. Ejecuta `python scripts/build.py`.
4. Sube únicamente `dist/` como artefacto de GitHub Pages.
5. Publica el artefacto en el entorno `github-pages`.

También se puede iniciar manualmente desde **Actions → Deploy to GitHub Pages → Run workflow**.

## Configuración inicial del repositorio

1. Sube estos archivos a la rama `main`.
2. En **Settings → Actions → General**, permite la ejecución de GitHub Actions.
3. En **Settings → Pages**, confirma que la fuente sea **GitHub Actions**.
4. Revisa la ejecución en la pestaña **Actions**.

El workflow intenta habilitar GitHub Pages automáticamente. Si la organización o el repositorio no permite hacerlo, configura **GitHub Actions** manualmente como fuente en **Settings → Pages** y vuelve a ejecutar el workflow.

Una vez desplegado, el sitio estará disponible en:

<https://aaossa.github.io/matri-vale-nini/>

## Publicar los cambios actuales

```bash
git add .
git commit -m "Prepare site for GitHub Pages"
git push origin main
```

No agregues `dist/` al commit: GitHub Actions lo genera durante cada deploy.
