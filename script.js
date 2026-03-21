/* ═══════════════════════════════════════════════════
   script.js – Pijamas Maricela
   ═══════════════════════════════════════════════════

   ÍNDICE:
   1. Navbar: scroll y menú hamburguesa
   2. Animaciones al hacer scroll
   3. Carrusel de fotos por producto (NUEVO)
   4. Selector de colores → cambia foto del carrusel (NUEVO)
   ═══════════════════════════════════════════════════ */


/* ─────────────────────────────────────────────────
   1. NAVBAR
───────────────────────────────────────────────── */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobLinks   = document.querySelectorAll('.mob-link');

// Navbar se achica al bajar el scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Abrir/cerrar menú hamburguesa
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
});

// Cerrar menú al tocar un link
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
  });
});


/* ─────────────────────────────────────────────────
   2. ANIMACIONES AL HACER SCROLL
───────────────────────────────────────────────── */
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

animatedElements.forEach(el => observer.observe(el));


/* ═══════════════════════════════════════════════════════════════════
   3. CARRUSEL DE FOTOS POR PRODUCTO
   ═══════════════════════════════════════════════════════════════════

   QUÉ HACE ESTE BLOQUE:
   • Lee las fotos del atributo data-images de cada .carousel-container
   • Crea las etiquetas <img> dentro de .carousel-track
   • Crea los puntitos indicadores dentro de .carousel-indicators
   • Maneja el movimiento con transform: translateX()
   • Permite navegar con flechas, puntitos, y swipe táctil (celular)

   CÓMO AGREGAR FOTOS A UN PRODUCTO:
   En el HTML, busca el .carousel-container del producto y edita
   el atributo data-images. Ejemplo:

     data-images='[
       "img/tulipan-rosado.jpg",
       "img/tulipan-negro.jpg",
       "img/tulipan-rojo.jpg"
     ]'

   REGLA IMPORTANTE:
   El orden de las fotos en data-images DEBE coincidir con el orden
   de los puntos de color (dots). Primer dot = primera foto, etc.

═════════════════════════════════════════════════════════════════════ */

// Selecciona todos los contenedores de carrusel en la página
const carousels = document.querySelectorAll('.carousel-container');

// Objeto que guarda el índice actual de cada carrusel
// Ejemplo: carouselState["1"] = 2  → el producto 1 está en la foto 3
const carouselState = {};

/**
 * inicializarCarrusel(container)
 * ────────────────────────────────
 * Toma un .carousel-container, lee sus fotos del data-images,
 * crea los <img> y los puntitos indicadores, y prepara los eventos.
 *
 * @param {HTMLElement} container - el div.carousel-container
 */
function inicializarCarrusel(container) {
  const productId = container.dataset.product;

  // Lee el array de rutas de fotos desde el atributo data-images
  // JSON.parse convierte el texto '[...]' en un array de JavaScript
  let imagenes;
  try {
    imagenes = JSON.parse(container.dataset.images);
  } catch (e) {
    // Si hay un error en el JSON (comillas mal puestas, etc.), avisa en consola
    console.warn(`Producto ${productId}: error leyendo data-images.`, e);
    return;
  }

  // Si no hay fotos, no hace nada
  if (!imagenes || imagenes.length === 0) return;

  // Guarda el estado inicial (foto 0 = primera foto)
  carouselState[productId] = 0;

  // Referencias a los elementos internos del carrusel
  const track      = container.querySelector('.carousel-track');
  const indicators = container.querySelector('.carousel-indicators');
  const btnPrev    = container.querySelector('.carousel-btn--prev');
  const btnNext    = container.querySelector('.carousel-btn--next');

  // ── Crear las imágenes ──────────────────────────────────────────
  // Por cada ruta en el array, crea un <img> y lo agrega a la pista
  imagenes.forEach((src, index) => {
    const img = document.createElement('img');
    img.src       = src;
    img.alt       = `Foto ${index + 1}`;
    img.className = 'carousel-img';

    // Si la imagen no carga (ruta incorrecta), muestra un fondo de color
    // en lugar de un ícono roto
    img.onerror = function() {
      // Reemplaza la imagen con un div de color para que no se vea roto
      // Puedes quitar este bloque cuando tengas todas las fotos
      this.style.background = 'linear-gradient(135deg, #fce8ef, #e8d49a)';
      this.style.opacity = '0.6';
    };

    track.appendChild(img);
  });

  // ── Crear los puntitos indicadores ─────────────────────────────
  // Si solo hay 1 foto, agrega la clase "single" para ocultar flechas y puntos
  if (imagenes.length <= 1) {
    container.classList.add('single');
    return; // no necesita más lógica si solo hay 1 foto
  }

  imagenes.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-indicator';
    dot.setAttribute('aria-label', `Ir a foto ${index + 1}`);

    // El primer puntito empieza activo
    if (index === 0) dot.classList.add('active');

    // Al hacer clic en un puntito, va directamente a esa foto
    dot.addEventListener('click', () => {
      irAFoto(productId, index, container);
    });

    indicators.appendChild(dot);
  });

  // ── Flechas de navegación ───────────────────────────────────────
  btnPrev.addEventListener('click', () => {
    const actual = carouselState[productId];
    const total  = imagenes.length;
    // Si está en la primera foto, va a la última (efecto circular)
    const nueva  = (actual - 1 + total) % total;
    irAFoto(productId, nueva, container);
  });

  btnNext.addEventListener('click', () => {
    const actual = carouselState[productId];
    const total  = imagenes.length;
    // Si está en la última foto, va a la primera (efecto circular)
    const nueva  = (actual + 1) % total;
    irAFoto(productId, nueva, container);
  });

  // ── Swipe táctil (celular) ──────────────────────────────────────
  // Detecta cuando el usuario desliza el dedo sobre el carrusel
  let touchStartX = 0;  // posición X donde empezó el toque
  let touchEndX   = 0;  // posición X donde terminó el toque

  // Al tocar la pantalla, guarda la posición inicial
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true }); // passive:true mejora el rendimiento del scroll

  // Al soltar el dedo, calcula si fue swipe izquierda o derecha
  container.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;

    // Solo activa si el deslizamiento fue de más de 40px
    // (evita activarse con toques accidentales)
    if (Math.abs(diff) > 40) {
      const actual = carouselState[productId];
      const total  = imagenes.length;

      if (diff > 0) {
        // Deslizó hacia la izquierda → siguiente foto
        irAFoto(productId, (actual + 1) % total, container);
      } else {
        // Deslizó hacia la derecha → foto anterior
        irAFoto(productId, (actual - 1 + total) % total, container);
      }
    }
  }, { passive: true });
}

/**
 * irAFoto(productId, indice, container)
 * ────────────────────────────────────────
 * Mueve el carrusel del producto indicado a la foto en la posición "indice".
 * También actualiza los puntitos indicadores y el punto de color activo.
 *
 * @param {string}      productId - número del producto (ej: "1")
 * @param {number}      indice    - posición de la foto (0 = primera)
 * @param {HTMLElement} container - el div.carousel-container
 */
function irAFoto(productId, indice, container) {
  // Actualiza el estado guardado
  carouselState[productId] = indice;

  // Mueve la pista: cada foto ocupa el 100%, así que para ir a la foto N
  // desplazamos la pista N * 100% hacia la izquierda
  const track = container.querySelector('.carousel-track');
  track.style.transform = `translateX(-${indice * 100}%)`;

  // Actualiza los puntitos indicadores (el activo se ve más grande y blanco)
  const indicators = container.querySelectorAll('.carousel-indicator');
  indicators.forEach((dot, i) => {
    dot.classList.toggle('active', i === indice);
  });

  // Actualiza los puntos de color: el que corresponde a esta foto queda activo
  // Busca el grupo de dots de este producto (puede estar fuera del container,
  // pero dentro del mismo .product-img-wrap)
  const wrap = container.closest('.product-img-wrap');
  if (wrap) {
    const colorDots = wrap.querySelectorAll('.dot');
    colorDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === indice);
    });

    // Actualiza la etiqueta de color (el texto que dice "Rosado Bebé", etc.)
    const activeDot   = colorDots[indice];
    const colorLabel  = wrap.querySelector('.color-label');
    if (activeDot && colorLabel) {
      colorLabel.textContent = activeDot.dataset.color || '';
    }

    // Actualiza el botón de WhatsApp con el color seleccionado
    // (para que el mensaje incluya el color cuando el cliente escriba)
    const buyBtn = wrap.closest('.product-card')
                       ?.querySelector(`.btn-buy[data-product="${productId}"]`);
    if (buyBtn && activeDot) {
      actualizarMensajeWhatsApp(buyBtn, activeDot.dataset.color);
    }
  }
}

// Inicializa todos los carruseles al cargar la página
carousels.forEach(container => inicializarCarrusel(container));


/* ═══════════════════════════════════════════════════════════════════
   4. SELECTOR DE COLORES → CAMBIA FOTO DEL CARRUSEL
   ═══════════════════════════════════════════════════════════════════

   QUÉ HACE ESTE BLOQUE:
   • Escucha los clics en los puntos de color (dots)
   • Cuando el cliente hace clic en un color, llama a irAFoto()
     para mover el carrusel a la foto de ese color
   • Actualiza la etiqueta de texto con el nombre del color
   • Actualiza el mensaje de WhatsApp con el color seleccionado

   RELACIÓN ENTRE COLORES Y FOTOS:
   Cada punto de color tiene un atributo data-index="N"
   que indica qué foto mostrar (empezando en 0).
   Ejemplo:
     <span class="dot" data-color="Negro" data-index="1">
     → al hacer clic, muestra la SEGUNDA foto (índice 1)

═════════════════════════════════════════════════════════════════════ */

// Selecciona todos los grupos de puntos de color
const colorGroups = document.querySelectorAll('.color-dots');

colorGroups.forEach(group => {
  const productId  = group.dataset.product;  // número del producto
  const colorLabel = document.getElementById('color-label-' + productId);
  const buyBtn     = document.querySelector(`.btn-buy[data-product="${productId}"]`);
  const dots       = group.querySelectorAll('.dot');

  dots.forEach(dot => {
    dot.addEventListener('click', () => {

      // Lee el índice de foto de este color (data-index)
      // Si no tiene data-index, usa la posición del dot en el grupo
      const indice = parseInt(dot.dataset.index ?? [...dots].indexOf(dot), 10);

      // Busca el contenedor del carrusel de este producto
      const container = document.querySelector(
        `.carousel-container[data-product="${productId}"]`
      );

      // Mueve el carrusel a la foto correspondiente a este color
      if (container) {
        irAFoto(productId, indice, container);
      } else {
        // Si no hay carrusel (ej: producto sin fotos aún), solo actualiza la etiqueta
        dots.forEach(d => d.classList.remove('active'));
        dot.classList.add('active');
        if (colorLabel) colorLabel.textContent = dot.dataset.color || '';
        if (buyBtn) actualizarMensajeWhatsApp(buyBtn, dot.dataset.color);
      }

    });
  });
});


/* ─────────────────────────────────────────────────
   FUNCIÓN AUXILIAR: actualizarMensajeWhatsApp
   ─────────────────────────────────────────────────
   Agrega el color seleccionado al mensaje de WhatsApp
   para que cuando el cliente escriba, el mensaje diga:
   "Hola Maricela! Quiero la Pijama Tulipán 🌸 | Color: Negro"

   @param {HTMLElement} btn       - el botón .btn-buy
   @param {string}      colorName - nombre del color (ej: "Negro")
───────────────────────────────────────────────── */
function actualizarMensajeWhatsApp(btn, colorName) {
  if (!btn || !colorName) return;

  // Decodifica la URL actual para trabajar con texto normal
  const urlActual = decodeURIComponent(btn.getAttribute('href'));

  // Elimina el color anterior si ya había uno (para no acumular)
  let urlBase;
  if (urlActual.includes(' | Color:')) {
    urlBase = urlActual.split(' | Color:')[0];
  } else {
    urlBase = urlActual;
  }

  // Codifica la nueva URL con el color incluido
  const nuevaUrl = encodeURI(urlBase + ' | Color: ' + colorName);
  btn.setAttribute('href', nuevaUrl);
}


/* ─────────────────────────────────────────────────
   FIN DEL ARCHIVO

   RESUMEN DE LO QUE DEBES HACER PARA AGREGAR FOTOS:

   1. Crea la carpeta "img/" en la misma carpeta del index.html

   2. Nombra las fotos así (sin tildes, sin espacios):
      img/tulipan-rosado.jpg
      img/tulipan-negro.jpg
      img/tulipan-rojo.jpg
      ... etc.

   3. En el HTML de cada producto, reemplaza las rutas en data-images:
      data-images='[
        "img/tulipan-rosado.jpg",
        "img/tulipan-negro.jpg",
        "img/tulipan-rojo.jpg"
      ]'

   4. Asegúrate de que el orden en data-images coincida
      con el orden de los dots (puntos de color).

   5. Guarda y recarga el navegador. ¡Listo!
───────────────────────────────────────────────── */