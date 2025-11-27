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
