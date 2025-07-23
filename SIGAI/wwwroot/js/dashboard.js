/**
 * Dashboard SuperAdmin - JavaScript
 * Funcionalidades principales del panel de administración
 */

class SuperAdminDashboard {
    constructor() {
        this.calendar = null;
        this.notifications = [];
        this.init();
    }

    /**
     * Inicializa el dashboard
     */
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeCalendar();
            this.setupEventListeners();
            this.loadNotifications();
            this.addCardInteractions();
            this.setupAnimations();
        });
    }

    /**
     * Inicializa el calendario FullCalendar
     */
    initializeCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (!calendarEl) return;

        this.calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'es',
            height: 'auto',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,listWeek'
            },
            events: this.getCalendarEvents(),
            eventClick: (info) => this.handleEventClick(info),
            dateClick: (info) => this.handleDateClick(info),
            eventMouseEnter: (info) => this.handleEventHover(info),
            loading: (isLoading) => this.handleCalendarLoading(isLoading)
        });

        this.calendar.render();
    }

    /**
     * Obtiene los eventos del calendario
     */
    getCalendarEvents() {
        return [
            {
                title: 'Reunión de coordinación',
                start: new Date().toISOString().split('T')[0],
                color: '#0d6efd',
                textColor: 'white',
                description: 'Reunión mensual del equipo de coordinación'
            },
            {
                title: 'Inicio de clases',
                start: '2025-08-01',
                color: '#198754',
                textColor: 'white',
                description: 'Inicio del nuevo período académico'
            },
            {
                title: 'Mantenimiento del sistema',
                start: '2025-07-25',
                color: '#ffc107',
                textColor: 'black',
                description: 'Mantenimiento programado del sistema'
            },
            {
                title: 'Backup de base de datos',
                start: '2025-07-30',
                color: '#dc3545',
                textColor: 'white',
                description: 'Respaldo automático de la base de datos'
            },
            {
                title: 'Capacitación docente',
                start: '2025-08-05',
                color: '#0dcaf0',
                textColor: 'white',
                description: 'Taller de capacitación para nuevos docentes'
            }
        ];
    }

    /**
     * Configura los event listeners principales
     */
    setupEventListeners() {
        // Navegación de las tarjetas
        const navButtons = document.querySelectorAll('[data-navigate]');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Notificaciones
        const bellIcon = document.querySelector('.bi-bell');
        if (bellIcon) {
            bellIcon.addEventListener('click', () => this.showNotifications());
            bellIcon.style.cursor = 'pointer';
        }

        // Profile image
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            profileImg.addEventListener('click', () => this.showProfileMenu());
            profileImg.style.cursor = 'pointer';
        }

        // Escape key handler
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModals();
            }
        });
    }

    /**
     * Agrega interacciones a las tarjetas del dashboard
     */
    addCardInteractions() {
        const cards = document.querySelectorAll('.dashboard-card');

        cards.forEach(card => {
            // Hover effects
            card.addEventListener('mouseenter', () => {
                card.classList.add('z-index-10');
            });

            card.addEventListener('mouseleave', () => {
                card.classList.remove('z-index-10');
                card.classList.add('z-index-1');
            });

            // Keyboard navigation
            card.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const button = card.querySelector('.dashboard-button');
                    if (button) button.click();
                }
            });

            // Make cards focusable
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
        });
    }

    /**
     * Configura animaciones de entrada
     */
    setupAnimations() {
        const cards = document.querySelectorAll('.dashboard-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('fade-in-up');
            }, index * 100);
        });
    }

    /**
     * Maneja la navegación entre secciones
     */
    async handleNavigation(event) {
        const button = event.target.closest('button');
        const section = button.dataset.navigate;

        if (!section) return;

        try {
            await this.showLoadingState(button);

            // Simular navegación - aquí iría la lógica real
            await this.simulateNavigation(section);

            // En una aplicación real, aquí harías:
            // window.location.href = `/Admin/${section}`;
            // o usar un router de SPA

        } catch (error) {
            this.showError('Error al navegar', error.message);
        } finally {
            this.hideLoadingState(button);
        }
    }

    /**
     * Simula el proceso de navegación
     */
    simulateNavigation(section) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.showSuccessMessage(`Navegando a ${section.toUpperCase()}`);
                resolve();
            }, 1000);
        });
    }

    /**
     * Muestra estado de carga en un botón
     */
    async showLoadingState(button) {
        const originalHTML = button.innerHTML;
        button.dataset.originalHtml = originalHTML;

        button.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Cargando...';
        button.disabled = true;
        button.classList.add('btn-loading');

        return new Promise(resolve => {
            requestAnimationFrame(resolve);
        });
    }

    /**
     * Oculta estado de carga
     */
    hideLoadingState(button) {
        const originalHTML = button.dataset.originalHtml;

        button.innerHTML = originalHTML;
        button.disabled = false;
        button.classList.remove('btn-loading');

        delete button.dataset.originalHtml;
    }

    /**
     * Maneja click en eventos del calendario
     */
    handleEventClick(info) {
        const event = info.event;
        const description = event.extendedProps.description || 'Sin descripción disponible';

        this.showModal('Detalles del Evento', `
            <div class="event-details">
                <h5 class="text-primary mb-3">${event.title}</h5>
                <p><strong>Fecha:</strong> ${event.start.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}</p>
                <p><strong>Descripción:</strong> ${description}</p>
            </div>
        `);
    }

    /**
     * Maneja click en fechas del calendario
     */
    handleDateClick(info) {
        const dateStr = info.dateStr;
        this.showModal('Crear Evento', `
            <form id="eventForm">
                <div class="mb-3">
                    <label for="eventTitle" class="form-label">Título del evento</label>
                    <input type="text" class="form-control" id="eventTitle" required>
                </div>
                <div class="mb-3">
                    <label for="eventDate" class="form-label">Fecha</label>
                    <input type="date" class="form-control" id="eventDate" value="${dateStr}" required>
                </div>
                <div class="mb-3">
                    <label for="eventDescription" class="form-label">Descripción</label>
                    <textarea class="form-control" id="eventDescription" rows="3"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Crear Evento</button>
            </form>
        `);

        // Manejar el formulario
        document.getElementById('eventForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createEvent();
        });
    }

    /**
     * Maneja hover en eventos
     */
    handleEventHover(info) {
        info.el.style.transform = 'scale(1.05)';
        info.el.style.zIndex = '1000';
    }

    /**
     * Maneja loading del calendario
     */
    handleCalendarLoading(isLoading) {
        const calendarEl = document.getElementById('calendar');
        if (isLoading) {
            calendarEl.style.opacity = '0.5';
        } else {
            calendarEl.style.opacity = '1';
        }
    }

    /**
     * Crea un nuevo evento
     */
    createEvent() {
        const title = document.getElementById('eventTitle').value;
        const date = document.getElementById('eventDate').value;
        const description = document.getElementById('eventDescription').value;

        if (this.calendar) {
            this.calendar.addEvent({
                title: title,
                start: date,
                color: '#28a745',
                description: description
            });

            this.showSuccessMessage('Evento creado exitosamente');
            this.closeModals();
        }
    }

    /**
     * Carga y muestra notificaciones
     */
    loadNotifications() {
        this.notifications = [
            {
                id: 1,
                title: 'Nuevo usuario registrado',
                message: 'Se ha registrado un nuevo usuario en el sistema',
                type: 'info',
                time: '5 min ago',
                read: false
            },
            {
                id: 2,
                title: 'Ticket de soporte #1234',
                message: 'Nuevo ticket de soporte requiere atención',
                type: 'warning',
                time: '15 min ago',
                read: false
            },
            {
                id: 3,
                title: 'Mantenimiento programado',
                message: 'Recordatorio: Mantenimiento del sistema mañana',
                type: 'danger',
                time: '1 hour ago',
                read: false
            }
        ];

        this.updateNotificationBadge();
    }

    /**
     * Actualiza el badge de notificaciones
     */
    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        const unreadCount = this.notifications.filter(n => !n.read).length;

        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    /**
     * Muestra panel de notificaciones
     */
    showNotifications() {
        const notificationsHtml = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? 'read' : 'unread'}" data-id="${notification.id}">
                <div class="d-flex align-items-start">
                    <i class="bi bi-${this.getNotificationIcon(notification.type)} me-3 text-${notification.type}"></i>
                    <div class="flex-grow-1">
                        <h6 class="mb-1">${notification.title}</h6>
                        <p class="mb-1 text-muted small">${notification.message}</p>
                        <small class="text-muted">${notification.time}</small>
                    </div>
                    <button class="btn btn-sm btn-outline-secondary ms-2" onclick="dashboard.markAsRead(${notification.id})">
                        <i class="bi bi-check"></i>
                    </button>
                </div>
            </div>
        `).join('');

        this.showModal('Notificaciones', `
            <div class="notifications-panel">
                ${notificationsHtml}
                <div class="text-center mt-3">
                    <button class="btn btn-outline-primary" onclick="dashboard.markAllAsRead()">
                        Marcar todas como leídas
                    </button>
                </div>
            </div>
        `);
    }

    /**
     * Obtiene el icono para un tipo de notificación
     */
    getNotificationIcon(type) {
        const icons = {
            info: 'info-circle',
            warning: 'exclamation-triangle',
            danger: 'exclamation-circle',
            success: 'check-circle'
        };
        return icons[type] || 'bell';
    }

    /**
     * Marca una notificación como leída
     */
    markAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id === notificationId);
        if (notification) {
            notification.read = true;
            this.updateNotificationBadge();

            const element = document.querySelector(`[data-id="${notificationId}"]`);
            if (element) {
                element.classList.add('read');
                element.classList.remove('unread');
            }
        }
    }

    /**
     * Marca todas las notificaciones como leídas
     */
    markAllAsRead() {
        this.notifications.forEach(notification => {
            notification.read = true;
        });
        this.updateNotificationBadge();
        this.closeModals();
        this.showSuccessMessage('Todas las notificaciones han sido marcadas como leídas');
    }

    /**
     * Muestra menú de perfil
     */
    showProfileMenu() {
        this.showModal('Perfil de Usuario', `
            <div class="profile-menu">
                <div class="text-center mb-4">
                    <img src="https://via.placeholder.com/80x80/007bff/ffffff?text=SA" 
                         class="rounded-circle mb-3" width="80" height="80" alt="Avatar">
                    <h5>SuperAdmin</h5>
                    <p class="text-muted">Administrador del Sistema</p>
                </div>
                <div class="list-group">
                    <a href="#" class="list-group-item list-group-item-action">
                        <i class="bi bi-person me-2"></i> Mi Perfil
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <i class="bi bi-gear me-2"></i> Configuración
                    </a>
                    <a href="#" class="list-group-item list-group-item-action">
                        <i class="bi bi-shield-check me-2"></i> Seguridad
                    </a>
                    <a href="#" class="list-group-item list-group-item-action text-danger">
                        <i class="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </a>
                </div>
            </div>
        `);
    }

    /**
     * Muestra un modal genérico
     */
    showModal(title, content) {
        // Crear modal si no existe
        let modal = document.getElementById('dynamicModal');
        if (!modal) {
            modal = this.createModalElement();
            document.body.appendChild(modal);
        }

        // Actualizar contenido
        modal.querySelector('.modal-title').textContent = title;
        modal.querySelector('.modal-body').innerHTML = content;

        // Mostrar modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    /**
     * Crea el elemento modal
     */
    createModalElement() {
        const modalHTML = `
            <div class="modal fade" id="dynamicModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body"></div>
                    </div>
                </div>
            </div>
        `;

        const div = document.createElement('div');
        div.innerHTML = modalHTML;
        return div.firstElementChild;
    }

    /**
     * Cierra todos los modales
     */
    closeModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const bsModal = bootstrap.Modal.getInstance(modal);
            if (bsModal) bsModal.hide();
        });
    }

    /**
     * Muestra mensaje de éxito
     */
    showSuccessMessage(message) {
        this.showToast('success', 'Éxito', message);
    }

    /**
     * Muestra mensaje de error
     */
    showError(title, message) {
        this.showToast('danger', title, message);
    }

    /**
     * Muestra toast notification
     */
    showToast(type, title, message) {
        const toastHTML = `
            <div class="toast align-items-center text-white bg-${type} border-0" role="alert">
                <div class="d-flex">
                    <div class="toast-body">
                        <strong>${title}:</strong> ${message}
                    </div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;

        let toastContainer = document.getElementById('toastContainer');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        const div = document.createElement('div');
        div.innerHTML = toastHTML;
        const toast = div.firstElementChild;

        toastContainer.appendChild(toast);

        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 4000
        });

        bsToast.show();

        // Limpiar después de ocultar
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    }

    /**
     * Obtiene estadísticas del dashboard
     */
    async getStats() {
        // Simular llamada a API
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    totalUsers: 1247,
                    activeTickets: 23,
                    totalCourses: 45,
                    systemHealth: 98.5
                });
            }, 500);
        });
    }

    /**
     * Actualiza las estadísticas en tiempo real
     */
    async updateStats() {
        try {
            const stats = await this.getStats();

            // Actualizar contadores (si existen elementos para mostrar stats)
            const statsElements = {
                users: document.querySelector('[data-stat="users"]'),
                tickets: document.querySelector('[data-stat="tickets"]'),
                courses: document.querySelector('[data-stat="courses"]'),
                health: document.querySelector('[data-stat="health"]')
            };

            if (statsElements.users) {
                this.animateCounter(statsElements.users, stats.totalUsers);
            }

            if (statsElements.tickets) {
                this.animateCounter(statsElements.tickets, stats.activeTickets);
            }

            if (statsElements.courses) {
                this.animateCounter(statsElements.courses, stats.totalCourses);
            }

            if (statsElements.health) {
                this.animateCounter(statsElements.health, stats.systemHealth, '%');
            }

        } catch (error) {
            console.error('Error updating stats:', error);
        }
    }

    /**
     * Anima un contador numérico
     */
    animateCounter(element, target, suffix = '') {
        const duration = 2000;
        const start = parseInt(element.textContent) || 0;
        const increment = (target - start) / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if ((increment > 0 && current >= target) || (increment < 0 && current <= target)) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    /**
     * Maneja errores globales
     */
    handleGlobalError(error) {
        console.error('Global error:', error);
        this.showError('Error del Sistema', 'Ha ocurrido un error inesperado. Por favor, contacte al administrador.');
    }

    /**
     * Exporta datos del dashboard
     */
    exportData(format = 'json') {
        const data = {
            timestamp: new Date().toISOString(),
            notifications: this.notifications,
            events: this.calendar ? this.calendar.getEvents().map(event => ({
                title: event.title,
                start: event.start,
                end: event.end,
                color: event.backgroundColor
            })) : [],
            userInfo: {
                name: 'SuperAdmin',
                role: 'Administrator',
                lastLogin: new Date().toISOString()
            }
        };

        let content, filename, type;

        switch (format) {
            case 'json':
                content = JSON.stringify(data, null, 2);
                filename = `dashboard-export-${new Date().getTime()}.json`;
                type = 'application/json';
                break;
            case 'csv':
                content = this.jsonToCsv(data.notifications);
                filename = `notifications-export-${new Date().getTime()}.csv`;
                type = 'text/csv';
                break;
            default:
                throw new Error('Formato no soportado');
        }

        this.downloadFile(content, filename, type);
    }

    /**
     * Convierte JSON a CSV
     */
    jsonToCsv(data) {
        if (!data || data.length === 0) return '';

        const headers = Object.keys(data[0]);
        const csvContent = [
            headers.join(','),
            ...data.map(row =>
                headers.map(header =>
                    JSON.stringify(row[header] || '')
                ).join(',')
            )
        ].join('\n');

        return csvContent;
    }

    /**
     * Descarga un archivo
     */
    downloadFile(content, filename, type) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);

        this.showSuccessMessage(`Archivo ${filename} descargado exitosamente`);
    }

    /**
     * Inicializa shortcuts de teclado
     */
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K para búsqueda rápida
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showQuickSearch();
            }

            // Alt + N para notificaciones
            if (e.altKey && e.key === 'n') {
                e.preventDefault();
                this.showNotifications();
            }

            // Alt + P para perfil
            if (e.altKey && e.key === 'p') {
                e.preventDefault();
                this.showProfileMenu();
            }
        });
    }

    /**
     * Muestra búsqueda rápida
     */
    showQuickSearch() {
        this.showModal('Búsqueda Rápida', `
            <div class="quick-search">
                <div class="mb-3">
                    <input type="text" class="form-control form-control-lg" 
                           id="quickSearchInput" 
                           placeholder="Buscar usuarios, carreras, tickets..." 
                           autofocus>
                </div>
                <div id="searchResults" class="search-results">
                    <div class="text-muted text-center py-4">
                        Comienza a escribir para ver resultados...
                    </div>
                </div>
            </div>
        `);

        const searchInput = document.getElementById('quickSearchInput');
        let searchTimeout;

        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performQuickSearch(e.target.value);
            }, 300);
        });
    }

    /**
     * Realiza búsqueda rápida
     */
    performQuickSearch(query) {
        const resultsContainer = document.getElementById('searchResults');

        if (!query.trim()) {
            resultsContainer.innerHTML = `
                <div class="text-muted text-center py-4">
                    Comienza a escribir para ver resultados...
                </div>
            `;
            return;
        }

        // Simular resultados de búsqueda
        const mockResults = [
            { type: 'user', title: 'Juan Pérez', subtitle: 'Estudiante - Ingeniería', url: '/usuarios/1' },
            { type: 'course', title: 'Ingeniería de Sistemas', subtitle: '45 estudiantes activos', url: '/carreras/1' },
            { type: 'ticket', title: 'Ticket #1234', subtitle: 'Problema con el sistema', url: '/tickets/1234' }
        ].filter(item =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.subtitle.toLowerCase().includes(query.toLowerCase())
        );

        if (mockResults.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-muted text-center py-4">
                    No se encontraron resultados para "${query}"
                </div>
            `;
            return;
        }

        const resultsHTML = mockResults.map(result => `
            <div class="search-result-item p-3 border-bottom" data-url="${result.url}">
                <div class="d-flex align-items-center">
                    <i class="bi bi-${this.getSearchIcon(result.type)} me-3 text-primary"></i>
                    <div>
                        <h6 class="mb-0">${result.title}</h6>
                        <small class="text-muted">${result.subtitle}</small>
                    </div>
                </div>
            </div>
        `).join('');

        resultsContainer.innerHTML = resultsHTML;

        // Agregar event listeners a los resultados
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.style.cursor = 'pointer';
            item.addEventListener('click', () => {
                const url = item.dataset.url;
                this.showSuccessMessage(`Navegando a: ${url}`);
                this.closeModals();
            });
        });
    }

    /**
     * Obtiene icono para tipo de búsqueda
     */
    getSearchIcon(type) {
        const icons = {
            user: 'person',
            course: 'mortarboard',
            ticket: 'ticket-detailed'
        };
        return icons[type] || 'search';
    }
}

// Inicializar dashboard cuando el DOM esté listo
const dashboard = new SuperAdminDashboard();

// Exponer funciones globales para uso en HTML
window.dashboard = dashboard;

// Función para navegación (compatibilidad con el HTML original)
window.navigateTo = function (section) {
    const event = { target: { closest: () => ({ dataset: { navigate: section } }) } };
    dashboard.handleNavigation(event);
};

// Manejo de errores globales
window.addEventListener('error', (e) => {
    dashboard.handleGlobalError(e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    dashboard.handleGlobalError(e.reason);
});

// Inicializar shortcuts de teclado
dashboard.initKeyboardShortcuts();