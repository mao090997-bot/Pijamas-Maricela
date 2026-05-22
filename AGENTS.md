# AGENTS.md — Pijamas Maricela

Site estático de una página (HTML/CSS/JS vanilla). Sin build step, sin dependencias, sin tests.

## Cómo empezar
- Abrir `index.html` directo en el navegador — no necesita servidor.
- No hay `package.json`, npm, ni CI.

## Estructura del proyecto
```
index.html      → sitio single-page (español)
assets/
├── css/
│   └── style.css   → todos los estilos
├── js/
│   └── script.js   → navbar, scroll, carrusel, color selector, WhatsApp, VideoMarquee
├── img/
│   ├── logo.png
│   ├── portada.jpeg
│   ├── bolsa.jpg
│   ├── producto-1/  → fotos Pijama Tulipán
│   ├── producto-2/  → fotos Pijama Luna
│   ├── producto-3/  → fotos Pijama Primavera (JPG optimizados)
│   ├── producto-4/  → fotos Pijama Dorada
│   ├── producto-5/  → fotos Pijama Mariposa
│   ├── producto-6/  → fotos Pijama Tulipán (2)
│   └── producto-7/  → fotos Pijama Estrella
└── videos/
    ├── video-01.mp4  → video 1
    ├── video-02.mp4  → video 2
    ├── video-03.mp4  → video 3
    ├── video-04.mp4  → video 4
    └── video-05.mp4  → video 5
.agents/     → skills de IA (intocable)
AGENTS.md    → este archivo
```

## Cómo agregar un producto nuevo
1. Copiar un bloque `.product-card` completo en `index.html`.
2. Cambiar `data-product="N"` al número siguiente (1–7 usados).
3. Agregar `style="--i: N"` en el `.product-card` para el delay de animación.
4. Actualizar `data-images='[...]'` con las rutas de fotos en `assets/img/producto-N/`. El orden **debe** coincidir con el orden de los dots de color.
5. Agregar un `<span class="dot">` por color con: `style="background:#HEX"`, `data-color="Nombre"`, `data-index="N"` (0-based). El primer dot lleva `class="dot active"`.
6. Poner nombre, descripción, precio y link de WhatsApp en `.product-info`.
7. Crear `assets/img/producto-N/` con las fotos.

## Sistema de carrusel (script.js)
- `.carousel-container[data-product="N"]` lee el JSON de `data-images`.
- `.carousel-track` se mueve con `transform: translateX(-N*100%)`.
- `.color-dots .dot[data-index]` mapea a la foto en esa posición.
- Swipe táctil (>40px) soportado en móvil.
- La etiqueta de color se actualiza desde `dot.dataset.color`.
- La URL del botón WhatsApp se actualiza dinámicamente con el color.
- Las imagenes del catalogo se crean desde JS con `loading="lazy"` y `decoding="async"` para mejorar la carga movil.

## WhatsApp
- Números principales: +57 318 830 0429, +57 316 696 7170.
- Cada `.btn-buy` tiene `data-product="N"` y `href` con mensaje predefinido.
- JS agrega ` | Color: ...` a la URL al hacer clic en un dot.

## Sistema de videos (VideoMarquee)
- Sección `<section class="videos" id="videos">` entre el catálogo y "Sobre Nosotros".
- Carrusel horizontal infinito con clones generados desde JS.
- Auto-play del video centrado: se reproduce el video más cercano al centro del viewport.
- Al entrar en la seccion, el video mas centrado queda alineado y se reproduce en silencio.
- La primera interaccion del usuario habilita audio para la sesion de videos.
- Al arrastrar con el dedo: si el gesto supera el umbral, pasa al siguiente/anterior.
- Al levantar el dedo: el video objetivo hace snap suave y queda centrado automaticamente.
- Si el gesto es pequeno, vuelve a centrar el video mas cercano.
- Los videos usan `preload="none"` en HTML/JS y pasan a `preload="auto"` solo al reproducirse.
- `prefers-reduced-motion: reduce` evita transiciones/animaciones innecesarias.
- `IntersectionObserver` silencia los videos al salir del viewport.

## Optimizacion de carga
- `index.html` usa `preconnect` para Google Fonts, Google Fonts Static y cdnjs.
- La imagen principal `assets/img/portada.jpeg` usa `fetchpriority="high"` y `decoding="async"`.
- Imagenes fuera del primer viewport usan `loading="lazy"` y `decoding="async"` cuando aplica.
- Producto 3 usa JPG optimizados (`ree1.jpg` a `ree5.jpg`) en lugar de los PNG originales.
- Los PNG originales de producto 3 fueron eliminados tras actualizar las rutas.
- Evitar volver a subir imagenes de producto pesadas; preferir JPG/WebP optimizados.

## Notas de estilo
- Variables CSS en `:root` para theming (dorado, rosa, crema).
- Fuentes: Cormorant Garamond (títulos), Jost (cuerpo) — Google Fonts.
- Iconos: Font Awesome 6.5.0.
- Animaciones: IntersectionObserver para scroll reveals, keyframes CSS para float/petal/pulse.
- Los delays de animación en productos usan `--i` inline (ej: `style="--i: 3"`).

## Regla de oro del carrusel
El orden de las fotos en `data-images` **debe** ser exactamente el mismo que el orden de los puntos de color (`.dot`). Primer dot = primera foto, segundo dot = segunda foto, etc.

## Gotchas comunes
- Las fotos están en `assets/img/producto-N/` organizadas por producto.
- Los nombres de archivo usan kebab-case (ej: `rosado-bebe.jpeg`).
- Producto 3 actualmente referencia `assets/img/producto-3/ree1.jpg` a `ree5.jpg`.
- Los videos están en `assets/videos/video-N.mp4` (nombres limpios).
- Los clones de video se generan automáticamente desde JS al cargar la página.
- Los links de redes sociales tienen placeholders `TU_USUARIO` / `TU_PAGINA`.
- Sin config de HTTPS o deploy — sitio estático puro.
- Los delays de productos se definen con `style="--i: N"` en cada `.product-card`.
- CSS usa `transition-delay: calc(0.04s * (var(--i, 1) - 1))` para escalonar. Si agregas/quitas productos, solo actualiza el `--i`.
