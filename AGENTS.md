# AGENTS.md — Pijamas Maricela

Site estático de una página (HTML/CSS/JS vanilla). Sin build step, sin dependencias, sin tests.

## Cómo empezar
- Abrir `index.html` directo en el navegador — no necesita servidor.
- No hay `package.json`, npm, ni CI.

## Estructura del proyecto
```
index.html   → sitio single-page (español, 607 líneas)
style.css    → todos los estilos (1077 líneas, 13 secciones)
script.js    → navbar, scroll animations, carrusel, selector color, WhatsApp (279 líneas)
recursos/    → imágenes (logos, fotos de productos)
.agents/     → skills de IA instalados con `npx autoskills`
AGENTS.md    → este archivo
```

## Cómo agregar un producto nuevo
1. Copiar un bloque `.product-card` completo en `index.html`.
2. Cambiar `data-product="N"` al número siguiente (1–8 usados).
3. Actualizar `data-images='[...]'` con las rutas de fotos. El orden **debe** coincidir con el orden de los dots de color.
4. Agregar un `<span class="dot">` por color con: `style="background:#HEX"`, `data-color="Nombre"`, `data-index="N"` (0-based). El primer dot lleva `class="dot active"`.
5. Poner nombre, descripción, precio y link de WhatsApp en `.product-info`.
6. La convención de nombres es `img/producto-color.jpg` (sin tildes, sin espacios, minúsculas) — aunque actualmente las fotos están en `recursos/` con subdirectorios.

## Sistema de carrusel (script.js)
- `.carousel-container[data-product="N"]` lee el JSON de `data-images`.
- `.carousel-track` se mueve con `transform: translateX(-N*100%)`.
- `.color-dots .dot[data-index]` mapea a la foto en esa posición.
- Swipe táctil (>40px) soportado en móvil.
- La etiqueta de color se actualiza desde `dot.dataset.color`.
- La URL del botón WhatsApp se actualiza dinámicamente con el color.

## WhatsApp
- Números principales: +57 318 830 0429, +57 316 696 7170.
- Cada `.btn-buy` tiene `data-product="N"` y `href` con mensaje predefinido.
- JS agrega ` | Color: ...` a la URL al hacer clic en un dot.

## Notas de estilo
- Variables CSS en `:root` para theming (dorado, rosa, crema).
- Fuentes: Cormorant Garamond (títulos), Jost (cuerpo) — Google Fonts.
- Iconos: Font Awesome 6.5.0.
- Animaciones: IntersectionObserver para scroll reveals, keyframes CSS para float/petal/pulse.

## Regla de oro del carrusel
El orden de las fotos en `data-images` **debe** ser exactamente el mismo que el orden de los puntos de color (`.dot`). Primer dot = primera foto, segundo dot = segunda foto, etc.

## Gotchas comunes
- La carpeta `img/` no existe — las fotos están en `recursos/` organizadas por subdirectorios de producto.
- Producto 1 tiene 4 fotos en `data-images` pero 6 colores planeados (Azul Oscuro y Lila comentados).
- Productos 6–8 usan `recursos/placeholder.jpg` — sin fotos reales todavía.
- Los links de redes sociales tienen placeholders `TU_USUARIO` / `TU_PAGINA`.
- Sin config de HTTPS o deploy — sitio estático puro.
