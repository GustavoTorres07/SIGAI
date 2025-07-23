document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggleSidebar');
    const sidebar = document.getElementById('sidebar');
    const pageContentWrapper = document.getElementById('page-content-wrapper');

    // Verificar que los elementos existen
    if (!toggleBtn || !sidebar || !pageContentWrapper) {
        console.error('Elementos del sidebar no encontrados');
        return;
    }

    // Inicializar estado expandido
    sidebar.style.width = '250px';
    pageContentWrapper.style.marginLeft = '0px';

    toggleBtn.addEventListener('click', function () {
        const isCollapsed = sidebar.classList.contains('collapsed');

        if (isCollapsed) {
            // EXPANDIR SIDEBAR
            expandSidebar();
        } else {
            // COLAPSAR SIDEBAR
            collapseSidebar();
        }
    });

    function collapseSidebar() {
        // Agregar clase collapsed
        sidebar.classList.add('collapsed');

        // Cambiar ancho
        sidebar.style.width = '70px';

        // Ocultar solo los textos de navegación (spans), NO los links completos
        const navSpans = document.querySelectorAll('.nav-link span');
        navSpans.forEach(span => {
            span.style.display = 'none';
        });

        // Ocultar textos de las categorías pero mantener la estructura
        const categorySpans = document.querySelectorAll('.nav-category span');
        categorySpans.forEach(span => {
            span.style.display = 'none';
        });

        // Ocultar información del usuario
        const userTexts = document.querySelectorAll('.user-profile div, .user-profile small');
        userTexts.forEach(text => {
            text.style.display = 'none';
        });

        // Ocultar título SIGAI
        const sidebarHeader = document.querySelector('.sidebar-header h4');
        if (sidebarHeader) {
            sidebarHeader.style.display = 'none';
        }

        // Ocultar separadores
        const separators = document.querySelectorAll('.nav-category-separator');
        separators.forEach(separator => {
            separator.style.display = 'none';
        });

        // Ajustar estilo de las categorías (mantenerlas pero sin texto)
        const categories = document.querySelectorAll('.nav-category');
        categories.forEach(category => {
            category.style.justifyContent = 'center';
            category.style.padding = '0.5rem 0';
        });

        // Rotar icono del botón
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('bi-chevron-left');
            icon.classList.add('bi-chevron-right');
        }

        // Centrar iconos de navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.justifyContent = 'center';
            link.style.padding = '0.75rem 0';
            link.style.textAlign = 'center';
        });

        // Ajustar iconos de navegación
        const navIcons = document.querySelectorAll('.nav-link i');
        navIcons.forEach(icon => {
            icon.classList.remove('me-2');
            icon.style.margin = '0';
        });

        // Centrar imagen de usuario
        const userImg = document.querySelector('.user-img');
        if (userImg) {
            userImg.style.width = '35px';
            userImg.style.height = '35px';
        }

        // Añadir tooltips en modo colapsado
        addTooltips();
    }

    function expandSidebar() {
        // Remover clase collapsed
        sidebar.classList.remove('collapsed');

        // Restaurar ancho
        sidebar.style.width = '250px';

        // Mostrar textos de navegación
        const navSpans = document.querySelectorAll('.nav-link span');
        navSpans.forEach(span => {
            span.style.display = 'inline';
        });

        // Mostrar textos de categorías
        const categorySpans = document.querySelectorAll('.nav-category span');
        categorySpans.forEach(span => {
            span.style.display = 'inline';
        });

        // Mostrar información del usuario
        const userTexts = document.querySelectorAll('.user-profile div, .user-profile small');
        userTexts.forEach(text => {
            text.style.display = 'block';
        });

        // Mostrar título SIGAI
        const sidebarHeader = document.querySelector('.sidebar-header h4');
        if (sidebarHeader) {
            sidebarHeader.style.display = 'block';
        }

        // Restaurar separadores
        const separators = document.querySelectorAll('.nav-category-separator');
        separators.forEach(separator => {
            separator.style.display = 'block';
        });

        // Restaurar estilo de categorías
        const categories = document.querySelectorAll('.nav-category');
        categories.forEach(category => {
            category.style.justifyContent = '';
            category.style.padding = '';
        });

        // Restaurar icono del botón
        const icon = toggleBtn.querySelector('i');
        if (icon) {
            icon.classList.remove('bi-chevron-right');
            icon.classList.add('bi-chevron-left');
        }

        // Restaurar alineación de navegación
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.style.justifyContent = '';
            link.style.padding = '';
            link.style.textAlign = '';
        });

        // Restaurar margins de iconos
        const navIcons = document.querySelectorAll('.nav-link i');
        navIcons.forEach(icon => {
            icon.classList.add('me-2');
            icon.style.margin = '';
        });

        // Restaurar tamaño imagen de usuario
        const userImg = document.querySelector('.user-img');
        if (userImg) {
            userImg.style.width = '';
            userImg.style.height = '';
        }

        // Remover tooltips
        removeTooltips();
    }

    function addTooltips() {
        // Agregar tooltips a los enlaces cuando está colapsado
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const span = link.querySelector('span');
            if (span) {
                const tooltipText = span.textContent.trim();
                link.setAttribute('title', tooltipText);
                link.setAttribute('data-bs-toggle', 'tooltip');
                link.setAttribute('data-bs-placement', 'right');
            }
        });

        // Inicializar tooltips de Bootstrap si está disponible
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    }

    function removeTooltips() {
        // Remover tooltips cuando se expande
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.removeAttribute('title');
            link.removeAttribute('data-bs-toggle');
            link.removeAttribute('data-bs-placement');
        });

        // Destruir instancias de tooltips
        const tooltips = document.querySelectorAll('[data-bs-toggle="tooltip"]');
        tooltips.forEach(tooltip => {
            const instance = bootstrap.Tooltip.getInstance(tooltip);
            if (instance) {
                instance.dispose();
            }
        });
    }

    // Función para manejar el redimensionado de ventana
    function handleResize() {
        if (window.innerWidth <= 768) {
            // En móvil/tablet, colapsar automáticamente
            if (!sidebar.classList.contains('collapsed')) {
                collapseSidebar();
            }
        }
    }

    // Escuchar cambios de tamaño de ventana
    window.addEventListener('resize', handleResize);

    // Verificar tamaño inicial
    handleResize();
});