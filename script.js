/* ═══════════════════════════════════════════════════
   script.js – Pijamas Maricela
   ═══════════════════════════════════════════════════

   ÍNDICE:
   1. Navbar: scroll y menú hamburguesa
   2. Animaciones al hacer scroll
   3. Selector de colores en productos
   ═══════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────
   1. NAVBAR
───────────────────────────────────────────────── */

// Referencia a los elementos del HTML
const navbar       = document.getElementById('navbar');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const mobLinks     = document.querySelectorAll('.mob-link');

// ── Navbar se achica al bajar el scroll ──────────
window.addEventListener('scroll', () => {
  // Si el scroll supera 50px, agrega la clase "scrolled"
  // La clase "scrolled" en el CSS reduce el padding del navbar
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// ── Abrir / cerrar menú hamburguesa ─────────────
hamburger.addEventListener('click', () => {
  // Alterna las clases "active" y "open" para la animación
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// ── Cerrar menú al tocar un link ────────────────
// (el usuario hace clic en un ítem del menú móvil
//  → el menú se cierra automáticamente)
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});


/* ─────────────────────────────────────────────────
   2. ANIMACIONES AL HACER SCROLL
   Usa IntersectionObserver para detectar cuando
   un elemento entra en la pantalla y agregarle
   la clase "visible" (que activa la animación en CSS)
───────────────────────────────────────────────── */

// Selecciona todos los elementos con clase "animate-on-scroll"
const animatedElements = document.querySelectorAll('.animate-on-scroll');

// Configura el observador
// threshold: 0.15 = el elemento debe estar 15% visible para activarse
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // El elemento es visible: agrega "visible" para activar la animación
        entry.target.classList.add('visible');
        // Una vez animado, deja de observarlo (para mejor rendimiento)
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

// Aplica el observador a cada elemento
animatedElements.forEach(el => observer.observe(el));


/* ─────────────────────────────────────────────────
   3. SELECTOR DE COLORES EN PRODUCTOS
   Cuando el usuario hace clic en un punto de color:
   - Ese punto se marca como "activo" (borde dorado)
   - La etiqueta de texto muestra el nombre del color
   - (Opcional avanzado) se podría cambiar la imagen
───────────────────────────────────────────────── */

// Selecciona todos los grupos de puntos de color
const colorGroups = document.querySelectorAll('.color-dots');

colorGroups.forEach(group => {
  // Lee el número de producto del atributo data-product
  // Ej: <div class="color-dots" data-product="1">  →  productId = "1"
  const productId = group.dataset.product;

  // Referencia a la etiqueta de texto del color para este producto
  const colorLabel = document.getElementById('color-label-' + productId);

  // Referencia al botón "Comprar" para actualizar el mensaje de WhatsApp
  const buyBtn = document.querySelector(`.btn-buy[data-product="${productId}"]`);

  // Selecciona todos los puntos de este grupo
  const dots = group.querySelectorAll('.dot');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {

      // 1. Quita la clase "active" de todos los puntos del grupo
      dots.forEach(d => d.classList.remove('active'));

      // 2. Agrega "active" al punto clickeado
      dot.classList.add('active');

      // 3. Lee el nombre del color del atributo data-color
      // Ej: data-color="Rosa Palo"
      const colorName = dot.dataset.color;

      // 4. Actualiza la etiqueta de texto con el nombre del color
      if (colorLabel) {
        colorLabel.textContent = colorName;
      }

      // 5. Actualiza el mensaje de WhatsApp del botón "Comprar"
      //    para incluir el color seleccionado
      //    (Opcional: puedes quitarlo si no lo necesitas)
      if (buyBtn) {
        const currentHref = buyBtn.getAttribute('href');

        // Busca y reemplaza el color en el mensaje de WhatsApp
        // El mensaje está en la URL después de "text="
        // Usamos una expresión regular para reemplazar "color=..." si existe
        // o simplemente añadimos el color al final del mensaje

        // Decodifica la URL para trabajar con texto normal
        const decodedUrl = decodeURIComponent(currentHref);

        // Extrae la base de la URL (sin el color anterior si lo había)
        // Divide por el separador del color que agregamos
        let baseUrl;
        if (decodedUrl.includes(' | Color:')) {
          // Ya tenía un color → reemplaza
          baseUrl = decodedUrl.split(' | Color:')[0];
        } else {
          baseUrl = decodedUrl;
        }

        // Construye la nueva URL con el color seleccionado
        const newUrl = encodeURI(baseUrl + ' | Color: ' + colorName);
        buyBtn.setAttribute('href', newUrl);
      }

    }); // fin click
  }); // fin forEach dot
}); // fin forEach group


/* ─────────────────────────────────────────────────
   FIN DEL ARCHIVO
   
   ¿Quieres agregar algo más?
   - Galería con lightbox: busca "lightbox2 cdn" en Google
   - Carrusel de fotos: busca "swiper.js cdn"
   - Formulario de contacto: usa Formspree.io (gratis)
───────────────────────────────────────────────── */