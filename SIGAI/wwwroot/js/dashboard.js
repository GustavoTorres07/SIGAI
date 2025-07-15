// Global variables
let calendar;
let systemData = {
    users: [],
    students: [],
    teachers: [],
    tickets: [],
    activities: [],
    studentRequests: []
};

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    initializeDashboard();
    setupNavigation();
    setupCalendar();
    updateDateTime();
    setInterval(updateDateTime, 60000); // Update every minute
});

function initializeDashboard() {
    showLoading();

    // Simulate API calls to load data
    setTimeout(() => {
        loadSystemData();
        hideLoading();
    }, 1500);
}

function showLoading() {
    document.getElementById('loadingSpinner').style.display = 'block';
    document.getElementById('dashboardContent').style.display = 'none';
}

function hideLoading() {
    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('dashboardContent').style.display = 'block';
}

function loadSystemData() {
    // Simulate loading data from your API
    // Replace these with actual API calls

    // Mock data for demonstration
    systemData.users = generateMockUsers();
    systemData.students = generateMockStudents();
    systemData.teachers = generateMockTeachers();
    systemData.tickets = generateMockTickets();
    systemData.activities = generateMockActivities();
    systemData.studentRequests = generateMockStudentRequests();

    updateStatistics();
    updateRecentActivity();
    updatePendingRequests();
}

function generateMockUsers() {
    return Array.from({ length: 245 }, (_, i) => ({
        id: i + 1,
        name: `Usuario ${i + 1}`,
        role: ['SuperAdmin', 'Docente', 'Estudiante', 'SecretarioInstitucion'][Math.floor(Math.random() * 4)],
        active: Math.random() > 0.1
    }));
}

function generateMockStudents() {
    return Array.from({ length: 189 }, (_, i) => ({
        id: i + 1,
        name: `Estudiante ${i + 1}`,
        career: ['Analista de Sistemas', 'Técnico en Informática', 'Ingeniería en Sistemas'][Math.floor(Math.random() * 3)],
        active: Math.random() > 0.05
    }));
}

function generateMockTeachers() {
    return Array.from({ length: 34 }, (_, i) => ({
        id: i + 1,
        name: `Docente ${i + 1}`,
        subjects: Math.floor(Math.random() * 3) + 1,
        active: Math.random() > 0.02
    }));
}

function generateMockTickets() {
    return Array.from({ length: 12 }, (_, i) => ({
        id: i + 1,
        title: `Ticket ${i + 1}`,
        status: ['Pendiente', 'En Proceso', 'Resuelto'][Math.floor(Math.random() * 3)],
        priority: ['Alta', 'Media', 'Baja'][Math.floor(Math.random() * 3)]
    }));
}

function generateMockActivities() {
    const activities = [
        'Nuevo usuario registrado',
        'Estudiante inscrito a materia',
        'Docente asignado a materia',
        'Ticket resuelto',
        'Plan de estudio actualizado',
        'Nuevo rol creado',
        'Configuración del sistema modificada'
    ];

    return Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        title: activities[Math.floor(Math.random() * activities.length)],
        user: `Usuario ${Math.floor(Math.random() * 50) + 1}`,
        time: new Date(Date.now() - Math.random() * 86400000 * 7).toLocaleString(),
        type: ['user', 'academic', 'system'][Math.floor(Math.random() * 3)]
    }));
}

function generateMockStudentRequests() {
    const careers = ['Analista de Sistemas', 'Técnico en Informática', 'Ingeniería en Sistemas'];
    const names = ['Juan Pérez', 'María García', 'Carlos López', 'Ana Martínez', 'Diego Rodríguez'];

    return Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        name: names[i],
        career: careers[Math.floor(Math.random() * careers.length)],
        dni: `${20000000 + Math.floor(Math.random() * 20000000)}`,
        date: new Date(Date.now() - Math.random() * 86400000 * 30).toLocaleDateString(),
        documents: ['DNI', 'Título Secundario', 'Certificado Antecedentes']
    }));
}

function updateStatistics() {
    document.getElementById('totalUsers').textContent = systemData.users.length;
    document.getElementById('totalStudents').textContent = systemData.students.filter(s => s.active).length;
    document.getElementById('totalTeachers').textContent = systemData.teachers.filter(t => t.active).length;
    document.getElementById('pendingTickets').textContent = systemData.tickets.filter(t => t.status === 'Pendiente').length;
}

function updateRecentActivity() {
    const activityContainer = document.getElementById('recentActivity');
    activityContainer.innerHTML = '';

    systemData.activities.forEach(activity => {
        const activityItem = createActivityItem(activity);
        activityContainer.appendChild(activityItem);
    });
}

function createActivityItem(activity) {
    const div = document.createElement('div');
    div.className = 'activity-item';

    const iconClass = activity.type === 'user' ? 'fas fa-user' :
        activity.type === 'academic' ? 'fas fa-book' : 'fas fa-cog';
    const iconColor = activity.type === 'user' ? 'var(--primary-orange)' :
        activity.type === 'academic' ? 'var(--primary-blue)' : 'var(--secondary-blue)';

    div.innerHTML = `
        <div class="activity-icon" style="background: ${iconColor}">
            <i class="${iconClass}"></i>
        </div>
        <div class="activity-content">
            <div class="activity-title">${activity.title}</div>
            <div class="activity-time">Por: ${activity.user} - ${activity.time}</div>
        </div>
    `;

    return div;
}

function updatePendingRequests() {
    const requestsContainer = document.getElementById('pendingRequests');
    requestsContainer.innerHTML = '';

    systemData.studentRequests.forEach(request => {
        const requestItem = createRequestItem(request);
        requestsContainer.appendChild(requestItem);
    });
}

function createRequestItem(request) {
    const div = document.createElement('div');
    div.className = 'request-item';

    div.innerHTML = `
        <div class="request-header">
            <div>
                <div class="request-name">${request.name}</div>
                <div class="request-career">${request.career} - DNI: ${request.dni}</div>
                <div class="request-career">Fecha: ${request.date}</div>
            </div>
        </div>
        <div class="request-actions">
            <button class="btn btn-success btn-sm" onclick="approveRequest(${request.id})">
                <i class="fas fa-check me-1"></i>Aprobar
            </button>
            <button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id})">
                <i class="fas fa-times me-1"></i>Rechazar
            </button>
            <button class="btn btn-outline-primary btn-sm" onclick="viewRequest(${request.id})">
                <i class="fas fa-eye me-1"></i>Ver Detalles
            </button>
        </div>
    `;

    return div;
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link[data-section]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));

            // Add active class to clicked link
            this.classList.add('active');

            // Load section content
            const section = this.getAttribute('data-section');
            loadSection(section);
        });
    });
}

function loadSection(section) {
    showLoading();

    // Simulate loading different sections
    setTimeout(() => {
        switch (section) {
            case 'dashboard':
                loadDashboardSection();
                break;
            case 'users':
                loadUsersSection();
                break;
            case 'student-requests':
                loadStudentRequestsSection();
                break;
            case 'roles':
                loadRolesSection();
                break;
            case 'careers':
                loadCareersSection();
                break;
            case 'subjects':
                loadSubjectsSection();
                break;
            case 'support':
                loadSupportSection();
                break;
            case 'audit':
                loadAuditSection();
                break;
            default:
                loadDashboardSection();
        }
        hideLoading();
    }, 800);
}

function loadDashboardSection() {
    // Dashboard is already loaded, just show it
    document.getElementById('dashboardContent').style.display = 'block';
}

function loadUsersSection() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
        <div class="header-section">
            <div class="d-flex justify-content-between align-items-center">
                <div class="welcome-text">
                    <h2>Gestión de Usuarios</h2>
                    <p>Administra todos los usuarios del sistema</p>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="createNewUser()">
                        <i class="fas fa-plus me-2"></i>Nuevo Usuario
                    </button>
                </div>
            </div>
        </div>

        <div class="dashboard-card">
            <div class="card-header">
                <i class="fas fa-users"></i>
                <h5>Lista de Usuarios</h5>
            </div>
            <div class="card-body">
                <div class="row mb-3">
                    <div class="col-md-4">
                        <input type="text" class="form-control" placeholder="Buscar usuario..." id="userSearch">
                    </div>
                    <div class="col-md-3">
                        <select class="form-select" id="roleFilter">
                            <option value="">Todos los roles</option>
                            <option value="SuperAdmin">Super Admin</option>
                            <option value="Docente">Docente</option>
                            <option value="Estudiante">Estudiante</option>
                            <option value="SecretarioInstitucion">Secretario</option>
                        </select>
                    </div>
                    <div class="col-md-2">
                        <button class="btn btn-outline-primary" onclick="filterUsers()">
                            <i class="fas fa-filter me-1"></i>Filtrar
                        </button>
                    </div>
                </div>
                <div class="table-responsive">
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Rol</th>
                                <th>Estado</th>
                                <th>Último Acceso</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                            <!-- Users will be populated here -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    populateUsersTable();
}

function loadStudentRequestsSection() {
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
        <div class="header-section">
            <div class="d-flex justify-content-between align-items-center">
                <div class="welcome-text">
                    <h2>Solicitudes de Estudiantes</h2>
                    <p>Gestiona las solicitudes de ingreso de nuevos estudiantes</p>
                </div>
                <div>
                    <button class="btn btn-primary" onclick="toggleRegistrationPeriod()">
                        <i class="fas fa-calendar-plus me-2"></i>Período de Inscripción
                    </button>
                </div>
            </div>
        </div>

        <div class="stats-grid mb-4">
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(255,107,53,0.1); color: var(--primary-orange);">
                    <i class="fas fa-clock"></i>
                </div>
                <div class="stat-number">5</div>
                <div class="stat-label">Solicitudes Pendientes</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(40,167,69,0.1); color: #28a745;">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="stat-number">23</div>
                <div class="stat-label">Aprobadas</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon" style="background: rgba(220,53,69,0.1); color: #dc3545;">
                    <i class="fas fa-times-circle"></i>
                </div>
                <div class="stat-number">3</div>
                <div class="stat-label">Rechazadas</div>
            </div>
        </div>

        <div class="dashboard-card">
            <div class="card-header">
                <i class="fas fa-user-plus"></i>
                <h5>Solicitudes de Ingreso</h5>
            </div>
            <div class="card-body">
                <div class="row">
                    ${systemData.studentRequests.map(request => `
                        <div class="col-md-6 mb-3">
                            <div class="request-item">
                                <div class="request-header">
                                    <div>
                                        <div class="request-name">${request.name}</div>
                                        <div class="request-career">${request.career} - DNI: ${request.dni}</div>
                                        <div class="request-career">Fecha: ${request.date}</div>
                                    </div>
                                </div>
                                <div class="request-actions">
                                    <button class="btn btn-success btn-sm" onclick="approveRequest(${request.id})">
                                        <i class="fas fa-check me-1"></i>Aprobar
                                    </button>
                                    <button class="btn btn-danger btn-sm" onclick="rejectRequest(${request.id})">
                                        <i class="fas fa-times me-1"></i>Rechazar
                                    </button>
                                    <button class="btn btn-outline-primary btn-sm" onclick="viewRequest(${request.id})">
                                        <i class="fas fa-eye me-1"></i>Ver Detalles
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

function setupCalendar() {
    const calendarEl = document.getElementById('calendar');

    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [
            {
                title: 'Mantenimiento Sistema',
                start: '2025-07-15T02:00:00',
                end: '2025-07-15T04:00:00',
                backgroundColor: '#dc3545',
                borderColor: '#dc3545'
            },
            {
                title: 'Inicio Período Inscripción',
                start: '2025-07-20',
                backgroundColor: '#28a745',
                borderColor: '#28a745'
            },
            {
                title: 'Fin Período Inscripción',
                start: '2025-08-15',
                backgroundColor: '#ffc107',
                borderColor: '#ffc107'
            },
            {
                title: 'Reunión Directores',
                start: '2025-07-18T10:00:00',
                end: '2025-07-18T12:00:00',
                backgroundColor: 'var(--primary-blue)',
                borderColor: 'var(--primary-blue)'
            }
        ],
        eventClick: function (info) {
            alert('Evento: ' + info.event.title + '\nFecha: ' + info.event.start.toLocaleDateString());
        }
    });

    calendar.render();
}

function updateDateTime() {
    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('es-ES', options);
}

function populateUsersTable() {
    const tbody = document.getElementById('usersTableBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    systemData.users.slice(0, 10).forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td><span class="badge bg-primary">${user.role}</span></td>
            <td>
                <span class="badge ${user.active ? 'bg-success' : 'bg-danger'}">
                    ${user.active ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>${new Date().toLocaleDateString()}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editUser(${user.id})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Dashboard functions
function refreshDashboard() {
    showLoading();
    setTimeout(() => {
        loadSystemData();
        hideLoading();
        showAlert('Datos actualizados correctamente', 'success');
    }, 1000);
}

function approveRequest(requestId) {
    if (confirm('¿Está seguro de aprobar esta solicitud?')) {
        showAlert('Solicitud aprobada. Se han creado las credenciales para el estudiante.', 'success');
        // Here you would make an API call to approve the request
        // Remove from pending requests
        systemData.studentRequests = systemData.studentRequests.filter(r => r.id !== requestId);
        updatePendingRequests();
        updateStatistics();
    }
}

function rejectRequest(requestId) {
    if (confirm('¿Está seguro de rechazar esta solicitud?')) {
        showAlert('Solicitud rechazada.', 'warning');
        // Here you would make an API call to reject the request
        systemData.studentRequests = systemData.studentRequests.filter(r => r.id !== requestId);
        updatePendingRequests();
        updateStatistics();
    }
}

function viewRequest(requestId) {
    const request = systemData.studentRequests.find(r => r.id === requestId);
    if (request) {
        alert(`Detalles de la solicitud:\n\nNombre: ${request.name}\nCarrera: ${request.career}\nDNI: ${request.dni}\nFecha: ${request.date}\nDocumentos: ${request.documents.join(', ')}`);
    }
}

function addSystemEvent() {
    const title = prompt('Ingrese el título del evento:');
    const date = prompt('Ingrese la fecha (YYYY-MM-DD):');

    if (title && date) {
        calendar.addEvent({
            title: title,
            start: date,
            backgroundColor: 'var(--primary-orange)',
            borderColor: 'var(--primary-orange)'
        });
        showAlert('Evento agregado al calendario', 'success');
    }
}

function createNewUser() {
    showAlert('Función de crear usuario - aquí abrirías un modal o redirigirías a un formulario', 'info');
}

function editUser(userId) {
    showAlert(`Editando usuario ID: ${userId}`, 'info');
}

function deleteUser(userId) {
    if (confirm('¿Está seguro de eliminar este usuario?')) {
        showAlert('Usuario eliminado', 'warning');
    }
}

function filterUsers() {
    const search = document.getElementById('userSearch')?.value.toLowerCase();
    const roleFilter = document.getElementById('roleFilter')?.value;
    showAlert('Filtros aplicados', 'info');
}

function toggleRegistrationPeriod() {
    showAlert('Período de inscripción configurado', 'success');
}

function logout() {
    if (confirm('¿Está seguro de cerrar sesión?')) {
        showAlert('Cerrando sesión...', 'info');
        // Here you would redirect to login page
        setTimeout(() => {
            window.location.href = '/login';
        }, 1000);
    }
}

function showAlert(message, type = 'info') {
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alert.style.cssText = 'top: 20px; right: 20px; z-index: 9999; max-width: 400px;';
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(alert);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 5000);
}

// Profile image upload simulation
document.getElementById('profileImg').addEventListener('click', function () {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('profileImg').src = e.target.result;
                showAlert('Foto de perfil actualizada', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
});

// Simulate real-time updates
setInterval(() => {
    // Update notification counts randomly
    const notificationCount = Math.floor(Math.random() * 10) + 1;
    const requestCount = Math.floor(Math.random() * 8) + 1;

    document.getElementById('notificationCount').textContent = notificationCount;
    document.getElementById('requestCount').textContent = requestCount;
}, 30000); // Update every 30 seconds

// Función para manejar el logout
function logout() {
    // Implementar lógica de cierre de sesión
    console.log("Cerrando sesión...");
    // window.location.href = "/Account/Logout";
}

// Función para actualizar el dashboard
function refreshDashboard() {
    document.getElementById('loadingSpinner').style.display = 'flex';
    document.getElementById('dashboardContent').style.opacity = '0.5';

    // Simular recarga de datos
    setTimeout(function () {
        document.getElementById('loadingSpinner').style.display = 'none';
        document.getElementById('dashboardContent').style.opacity = '1';
        // Aquí iría la llamada AJAX para actualizar los datos
        console.log("Datos actualizados");
    }, 1500);
}

// Función para agregar eventos al calendario
function addSystemEvent() {
    // Implementar lógica para agregar eventos
    console.log("Agregando nuevo evento al sistema...");
}

document.getElementById('logoutLink').addEventListener('click', function (e) {
    e.preventDefault(); // Evita que el enlace navegue
    document.getElementById('logoutForm').submit(); // Envía el formulario
});

// Opción 2: Directamente en el HTML (si no usas archivo .js)

document.getElementById('logoutLink').onclick = function (e) {
    e.preventDefault();
    document.getElementById('logoutForm').submit();
};