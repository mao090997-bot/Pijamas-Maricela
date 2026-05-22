/* ─── 1. NAVBAR ─── */
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
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('active');
  hamburger.setAttribute('aria-expanded', isOpen);
  hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
});

// Cerrar menú al tocar un link
mobLinks.forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Abrir menú');
  });
});


/* ─── 2. SCROLL ANIMATIONS ─── */
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


/* ─── 3. CARRUSEL ─── */

// Selecciona todos los contenedores de carrusel en la página
const carousels = document.querySelectorAll('.carousel-container');

// Objeto que guarda el índice actual de cada carrusel
// Ejemplo: carouselState["1"] = 2  → el producto 1 está en la foto 3
const carouselState = {};

function inicializarCarrusel(container) {
  const productId = container.dataset.product;
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
  const productName = container.closest('.product-card')?.querySelector('.product-name')?.textContent?.trim() || `Producto ${productId}`;
  const colorNames = container.closest('.product-img-wrap')?.querySelectorAll('.color-dots .dot');

  imagenes.forEach((src, index) => {
    const img = document.createElement('img');
    img.src       = src;
    const colorName = colorNames?.[index]?.dataset?.color || `Foto ${index + 1}`;
    img.alt       = `${productName} - Color: ${colorName}`;
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
  let touchStartY = 0;  // posición Y donde empezó el toque

  // Al tocar la pantalla, guarda la posición inicial
  container.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true }); // passive:true mejora el rendimiento del scroll

  // Al soltar el dedo, calcula si fue swipe izquierda o derecha
  container.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const touchEndY = e.changedTouches[0].screenY;
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    const absX = Math.abs(diffX);
    const absY = Math.abs(diffY);

    // Solo activa si el deslizamiento fue claramente horizontal
    // (evita cambiar fotos al bajar por el catálogo)
    if (absX > 50 && absX > absY * 1.4) {
      const actual = carouselState[productId];
      const total  = imagenes.length;

      if (diffX > 0) {
        // Deslizó hacia la izquierda → siguiente foto
        irAFoto(productId, (actual + 1) % total, container);
      } else {
        // Deslizó hacia la derecha → foto anterior
        irAFoto(productId, (actual - 1 + total) % total, container);
      }
    }
  }, { passive: true });
}

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


/* ─── 4. SELECTOR DE COLORES ─── */

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


// ─────────────────────────────────────
// VIDEO MARQUEE PRO
// ─────────────────────────────────────

const VideoMarquee = (() => {

  const track = document.getElementById('videoTrack');
  const marquee = document.querySelector('.video-marquee');

  if (!track || !marquee) return;

  const SPEED = 0.35;

  let pos = 0;
  let animationId = null;

  let dragging = false;
  let startX = 0;
  let initialPos = 0;

  let velocity = 0;

  let currentCard = null;
  let isInView = false;
  let hasDragged = false;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // ─────────────────────────────
  // CARDS ORIGINALES
  // ─────────────────────────────
  const originalCards = [...track.querySelectorAll('.video-card')];

  // ─────────────────────────────
  // CLONAR PARA LOOP INFINITO
  // ─────────────────────────────
  originalCards.forEach(card => {

    const clone = card.cloneNode(true);

    clone.setAttribute('aria-hidden', 'true');

    track.appendChild(clone);
  });

  // ─────────────────────────────
  // TODAS LAS CARDS
  // ─────────────────────────────
  const allCards = [...track.querySelectorAll('.video-card')];

  // ─────────────────────────────
  // CONFIGURAR VIDEOS
  // ─────────────────────────────
  allCards.forEach(card => {

    const video = card.querySelector('video');

    video.muted = true;

    video.controls = false;

    video.removeAttribute('controls');

    video.loop = true;

    video.playsInline = true;

    video.preload = 'metadata';
  });

  // ─────────────────────────────
  // WRAP INFINITO
  // ─────────────────────────────
  function wrap() {

    const half = track.scrollWidth / 2;

    if (pos <= -half) pos += half;

    if (pos >= 0) pos -= half;
  }

  // ─────────────────────────────
  // DETECTAR CARD ACTIVA
  // ─────────────────────────────
  function silenceVideos() {

    allCards.forEach(card => {

      const video = card.querySelector('video');

      video.muted = true;
    });
  }

  function updateActiveCard(forceSound = false) {

    const marqueeRect = marquee.getBoundingClientRect();

    const center = marqueeRect.left + marqueeRect.width / 2;

    let closest = null;

    let closestDistance = Infinity;

    allCards.forEach(card => {

      const rect = card.getBoundingClientRect();

      const cardCenter = rect.left + rect.width / 2;

      const distance = Math.abs(center - cardCenter);

      if (distance < closestDistance) {

        closestDistance = distance;

        closest = card;
      }
    });

    if (!closest) return;

    if (closest === currentCard) {

      if (forceSound && !dragging) {

        const activeVideo = closest.querySelector('video');

        activeVideo.muted = false;

        activeVideo.play().catch(() => {});
      }

      return;
    }

    currentCard = closest;

    // RESET TODAS
    allCards.forEach(card => {

      card.classList.remove('active');

      const video = card.querySelector('video');

      video.pause();

      video.currentTime = 0;

      video.muted = true;

    });

    // ACTIVAR NUEVA
    closest.classList.add('active');

    const activeVideo = closest.querySelector('video');

    activeVideo.muted = dragging ? true : false;

    activeVideo.play().catch(() => {});
  }

  function moveCardToCenter(card) {

    const marqueeRect = marquee.getBoundingClientRect();

    const cardRect = card.getBoundingClientRect();

    const marqueeCenter = marqueeRect.left + marqueeRect.width / 2;

    const cardCenter = cardRect.left + cardRect.width / 2;

    pos += marqueeCenter - cardCenter;

    wrap();

    track.style.transform = `translate3d(${pos}px, 0, 0)`;
  }

  function startAnimation() {

    if (animationId || reducedMotion.matches) return;

    animationId = requestAnimationFrame(animate);
  }

  // ─────────────────────────────
  // ANIMACIÓN PRINCIPAL
  // ─────────────────────────────
  function animate() {

    if (!dragging) {

      const activeVideo = currentCard?.querySelector('video');

      if (!activeVideo || activeVideo.paused) {

        pos -= SPEED;
      }

      pos += velocity;

      velocity *= 0.95;

      if (Math.abs(velocity) < 0.02) {

        velocity = 0;
      }
    }

    wrap();

    track.style.transform = `translate3d(${pos}px, 0, 0)`;

    updateActiveCard();

    animationId = requestAnimationFrame(animate);
  }

  // ─────────────────────────────
  // DRAG START
  // ─────────────────────────────
  function dragStart(x) {

    dragging = true;

    hasDragged = false;

    silenceVideos();

    startX = x;

    initialPos = pos;

    marquee.style.cursor = 'grabbing';
  }

  // ─────────────────────────────
  // DRAG MOVE
  // ─────────────────────────────
  function dragMove(x) {

    if (!dragging) return;

    const delta = x - startX;

    if (Math.abs(delta) > 8) {

      hasDragged = true;

      silenceVideos();
    }

    pos = initialPos + delta;

    velocity = delta * 0.015;
  }

  // ─────────────────────────────
  // DRAG END
  // ─────────────────────────────
  function dragEnd() {

    dragging = false;

    marquee.style.cursor = 'grab';

    if (isInView) {

      updateActiveCard(true);
    }
  }

  // ─────────────────────────────
  // DESKTOP EVENTS
  // ─────────────────────────────
  marquee.addEventListener('mousedown', e => {

    dragStart(e.clientX);
  });

  window.addEventListener('mousemove', e => {

    dragMove(e.clientX);
  });

  window.addEventListener('mouseup', dragEnd);

  // ─────────────────────────────
  // TOUCH EVENTS
  // ─────────────────────────────
  marquee.addEventListener('touchstart', e => {

    dragStart(e.touches[0].clientX);

  }, { passive: true });

  window.addEventListener('touchmove', e => {

    dragMove(e.touches[0].clientX);

  }, { passive: true });

  window.addEventListener('touchend', dragEnd);

  // ─────────────────────────────
  // CLICK EN VIDEO
  // ─────────────────────────────
  allCards.forEach(card => {

    const video = card.querySelector('video');

    card.addEventListener('click', () => {

      if (hasDragged) return;

      if (!card.classList.contains('active')) {

        moveCardToCenter(card);

        updateActiveCard();

        return;
      }

      if (video.paused) {

        video.muted = false;

        video.play();

      } else {

        video.pause();
      }
    });
  });

  // ─────────────────────────────
  // INTERSECTION OBSERVER
  // ─────────────────────────────
  const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

      if (!entry.isIntersecting) {

        isInView = false;

        cancelAnimationFrame(animationId);

        animationId = null;

        currentCard = null;

        allCards.forEach(card => {

          const video = card.querySelector('video');

          video.pause();

          video.currentTime = 0;

          video.muted = true;
        });

      } else {

        isInView = true;

        updateActiveCard();

        startAnimation();
      }
    });

  }, {
    threshold: 0.2
  });

  observer.observe(marquee);

})();
