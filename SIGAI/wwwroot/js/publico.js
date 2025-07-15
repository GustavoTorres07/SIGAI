document.addEventListener('DOMContentLoaded', function () {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Activar ítem del menú según sección visible
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-link');

    function activateMenuItem() {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (pageYOffset >= (sectionTop - 100)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });

                // Actualizar el menú después del scroll
                setTimeout(activateMenuItem, 1000);
            }
        });
    });

    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', function () {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Actualizar menú activo al hacer scroll
        activateMenuItem();
    });

    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Botón Campus Estudiante
    const campusBtn = document.getElementById('campusBtn');
    if (campusBtn) {
        campusBtn.addEventListener('click', function (e) {
            e.preventDefault();
            const campusModal = new bootstrap.Modal(document.getElementById('campusModal'));
            campusModal.show();
        });
    }

    // Form submission handlers
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            showAlert('success', 'Gracias por tu mensaje. Nos pondremos en contacto contigo pronto.');
            this.reset();
        });
    }

    // Inicializar las tarjetas flotantes
    initFloatingCards();

    // Animate elements when they come into view
    const animateOnScroll = function () {
        const elements = document.querySelectorAll('.feature-card, .module-card, .about-feature');

        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;

            if (elementPosition < screenPosition) {
                element.classList.add('animate-fade-in-up');
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Run once on page load

    // Activar el menú al cargar la página
    activateMenuItem();
});

// Animación mejorada para las tarjetas flotantes
// Eliminar o reemplazar esta función en el JS
function initFloatingCards() {
    // Solo para móviles - asegurar que las tarjetas sean visibles
    if (window.innerWidth < 992) {
        const cards = document.querySelectorAll('.floating-card');
        cards.forEach(card => {
            card.style.opacity = '1';
            card.style.animation = 'none';
            card.style.transform = 'none';
        });
    }
}

// Mostrar alertas personalizadas
function showAlert(type, message) {
    const alertPlaceholder = document.getElementById('alertPlaceholder');
    if (!alertPlaceholder) return;

    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible fade show" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);

    // Eliminar la alerta después de 5 segundos
    setTimeout(() => {
        wrapper.remove();
    }, 5000);
}

// Modal functions
function showLogin() {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
}

function showDemo() {
    const demoModal = new bootstrap.Modal(document.getElementById('demoModal'));
    demoModal.show();
}

// Reiniciar animaciones al redimensionar
window.addEventListener('resize', function () {
    initFloatingCards();
});