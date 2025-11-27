//ANIMACIONES DE SCROLL Y CARGA
document.addEventListener("DOMContentLoaded", () => {

    // Elementos que aparecerán con scroll
    const elementosAnimar = document.querySelectorAll(
        ".seccion, .tarjeta, .galeria-grid img"
    );

    const observer = new IntersectionObserver(
        (entradas, obs) => {
            entradas.forEach((entrada) => {
                if (entrada.isIntersecting) {
                    entrada.target.classList.add("animar-aparicion");
                    obs.unobserve(entrada.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    elementosAnimar.forEach((el) => observer.observe(el));

    // Animación de header al cargar
    const header = document.querySelector("header");
    if (header) header.classList.add("header-animado");

    // Logo animado
    const logo = document.querySelector(".logo");
    if (logo) logo.classList.add("logo-animado");

    // Smooth scroll para los enlaces
    const enlaces = document.querySelectorAll('nav a[href^="#"]');

    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", (e) => {
            e.preventDefault();
            const destino = document.querySelector(enlace.getAttribute("href"));
            destino.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    // Efecto del header cuando se hace scroll
    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("header-scroll");
        } else {
            header.classList.remove("header-scroll");
        }
    });

});

//LIGHTBOX (tu código original)
document.addEventListener('DOMContentLoaded', function () {
	const galleryImgs = document.querySelectorAll('.galeria-grid img');
	const lightbox = document.getElementById('lightbox');
	const lightboxImg = document.getElementById('lightbox-img');

	function openLightbox(src, alt) {
		lightboxImg.src = src;
		lightboxImg.alt = alt || '';
		lightbox.classList.add('active');
		document.body.classList.add('lightbox-open');
		lightbox.setAttribute('aria-hidden', 'false');
	}

	function closeLightbox() {
		lightbox.classList.remove('active');
		document.body.classList.remove('lightbox-open');
		lightbox.setAttribute('aria-hidden', 'true');
	}

	galleryImgs.forEach(img => {
		img.addEventListener('click', () => {
			openLightbox(img.src, img.alt);
		});
	});

	// Botón de cerrar (X)
	document.querySelectorAll('.close-button').forEach(button => {
		button.addEventListener('click', closeLightbox);
	});

	// Cerrar si se hace click fuera de la imagen (en el overlay)
	lightbox.addEventListener('click', (e) => {
		if (e.target === lightbox) closeLightbox();
	});

	// Cerrar con tecla Esc
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && lightbox.classList.contains('active')) {
			closeLightbox();
		}
	});
});

//Para el botón ☰ en responsivve 
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('nav ul');

menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Cerrar menú al hacer clic en un enlace
document.querySelectorAll('nav ul li a').forEach(enlace => {
    enlace.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

/* ------------------ SISTEMA DE PARTICULAS SUBTILES ------------------ */
(function () {
    // Respetar prefer-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let canvas = document.createElement('canvas');
    canvas.className = 'particles-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.appendChild(canvas);
    // asegurar transparencia y z-index desde JS
    canvas.style.background = 'transparent';
    canvas.style.zIndex = '4000';

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width = 0, height = 0, dpr = window.devicePixelRatio || 1;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        // Calcular cantidad según área (muy sutil): 1 por cada ~80k px, con tope
        const area = width * height;
        const count = Math.min(80, Math.max(18, Math.floor(area / 80000)));
        if (particles.length > count) particles = particles.slice(0, count);
        while (particles.length < count) particles.push(createParticle());
    }

    function rnd(min, max) { return Math.random() * (max - min) + min; }

    function createParticle() {
        // Aumento sutil del tamaño para mayor visibilidad
        const size = rnd(1.8, 5.0); // píxeles (ligeramente más grandes)
        const speed = rnd(0.05, 0.45); // velocidad baja
        const angle = rnd(0, Math.PI * 2);
        return {
            x: rnd(0, width),
            y: rnd(0, height),
            vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
            vy: Math.sin(angle) * speed * (Math.random() < 0.5 ? -1 : 1),
            r: size,
            // mayor alpha para visibilidad sutil (pero no intrusiva)
            alpha: rnd(0.10, 0.34)
        };
    }

    let lastTime = 0;
    // Rectángulos bloqueados donde NO dibujar partículas (elementos con fondo o imágenes)
    let blockedRects = [];

    function isNearlyWhite(rgbString) {
        if (!rgbString) return false;
        // ejemplos: 'rgba(255, 255, 255, 1)' o 'rgb(255, 255, 255)'
        const m = rgbString.match(/rgba?\(([^)]+)\)/);
        if (!m) return false;
        const parts = m[1].split(',').map(s => parseFloat(s.trim()));
        const r = parts[0] || 0, g = parts[1] || 0, b = parts[2] || 0, a = (parts[3] === undefined ? 1 : parts[3]);
        if (a === 0) return false; // transparente -> no bloquear
        // Considerar blanco si los canales son muy altos
        return (r >= 245 && g >= 245 && b >= 245);
    }

    function computeBlockedRects() {
        blockedRects = [];
        // Revisar elementos que probablemente tapen partículas: con background-image o con background-color no transparente y no blanco
        const all = document.querySelectorAll('body *');
        for (let el of all) {
            const style = getComputedStyle(el);
            if (!style) continue;
            const bgImage = style.backgroundImage;
            const bgColor = style.backgroundColor;
            // Bloquear si tiene imagen de fondo
            if (bgImage && bgImage !== 'none') {
                blockedRects.push(el.getBoundingClientRect());
                continue;
            }
            // Bloquear si tiene color de fondo visible y NO es casi blanco
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
                if (!isNearlyWhite(bgColor)) {
                    blockedRects.push(el.getBoundingClientRect());
                    continue;
                }
            }
            // Bloquear imágenes (img tags)
            if (el.tagName === 'IMG') blockedRects.push(el.getBoundingClientRect());
        }
        // Añadir elementos con z-index alto como nav, header, footer, tarjetas manualmente para seguridad
        ['header', 'nav', '.tarjeta', '.tarjeta-p', '.tarjeta-f', '.galeria-grid'].forEach(sel => {
            document.querySelectorAll(sel).forEach(e => blockedRects.push(e.getBoundingClientRect()));
        });
    }
    // Obtener color base desde CSS (fallback a azul oscuro) y convertir a rgb
    function hexToRgb(hex) {
        if (!hex) return null;
        hex = hex.replace('#', '').trim();
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const int = parseInt(hex, 16);
        return { r: (int >> 16) & 255, g: (int >> 8) & 255, b: int & 255 };
    }

    const cssColor = (window.getComputedStyle && getComputedStyle(document.documentElement).getPropertyValue('--azul-oscuro')) || '#120083';
    const baseRgb = hexToRgb(cssColor) || { r: 18, g: 0, b: 131 };

    function animate(t) {
        const dt = Math.min(40, t - lastTime);
        lastTime = t;
        ctx.clearRect(0, 0, width, height);

        for (let p of particles) {
            p.x += p.vx * (dt * 0.06);
            p.y += p.vy * (dt * 0.06);

            // ligera oscilación
            p.x += Math.sin((t + p.x) * 0.0006) * 0.12;
            p.y += Math.cos((t + p.y) * 0.0007) * 0.12;

            // wrap alrededor
            if (p.x < -10) p.x = width + 10;
            if (p.x > width + 10) p.x = -10;
            if (p.y < -10) p.y = height + 10;
            if (p.y > height + 10) p.y = -10;

            ctx.beginPath();
            // Evitar dibujar si la partícula está sobre un rect bloqueado
            let blocked = false;
            for (let r of blockedRects) {
                if (p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom) { blocked = true; break; }
            }
            if (blocked) continue;

            // Color sutil basado en la paleta del sitio, con la alpha de la partícula
            ctx.fillStyle = 'rgba(' + baseRgb.r + ',' + baseRgb.g + ',' + baseRgb.b + ',' + p.alpha + ')';
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
        }

        // Muy sutil: rebaja la opacidad si hay elementos activos (por ejemplo, foco en lightbox)
        const lb = document.getElementById('lightbox');
        // Control manual de opacidad del canvas (dejamos el canvas opaco y controlamos la transparencia en cada partícula)
        if (lb && lb.classList.contains('active')) {
            canvas.style.opacity = '0.5';
        } else {
            canvas.style.opacity = '1';
        }

        requestAnimationFrame(animate);
    }

    // DEBUG: indicar que se creó el canvas y cuántas partículas
    console.debug('Particles: canvas created, initial particle target will be computed on resize.');

    // Inicializar
    window.addEventListener('resize', resize, { passive: true });
    // Si el DOM ya está listo, inicializar ahora. De lo contrario, esperar al load.
    function start() {
        resize();
        // Calcular áreas bloqueadas inicialmente
        computeBlockedRects();
        // Volver a calcular cuando el DOM cambie (pocas veces)
        const mo = new MutationObserver(() => computeBlockedRects());
        mo.observe(document.body, { childList: true, subtree: true, attributes: true });
        // Recalcular en resize (ya hay listener), pero llamar ahora para sincronizar
        window.addEventListener('resize', computeBlockedRects, { passive: true });
        lastTime = performance.now();
        requestAnimationFrame(animate);
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        start();
    } else {
        window.addEventListener('DOMContentLoaded', start, { once: true });
    }

    // Exponer una forma segura de desactivar (no usada por defecto)
    window.__particlesSafeDisable = function () {
        try { window.removeEventListener('resize', resize); canvas.remove(); } catch (e) {}
    };
})();
