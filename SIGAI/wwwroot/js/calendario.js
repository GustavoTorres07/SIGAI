document.addEventListener('DOMContentLoaded', function () {
    // ==================== VERIFICACIONES INICIALES ====================
    if (!document.getElementById('calendar')) {
        console.error('No se encontró el elemento con ID "calendar"');
        return;
    }

    if (!window.calendarioPermisos) {
        console.error('Permisos no definidos - window.calendarioPermisos no existe');
        window.calendarioPermisos = {
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false,
            userRole: 'Invitado'
        };
    }

    // ==================== CONFIGURACIÓN INICIAL ====================
    const { puedeCrear, puedeEditar, puedeEliminar, userRole } = window.calendarioPermisos;
    let currentEvent = null;
    let resizeTimer;

    // ==================== INICIALIZACIÓN FULLCALENDAR ====================
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: {
            url: '/Calendario/Listar',
            method: 'GET',
            failure: function (error) {
                console.error('Error al cargar eventos:', error);
                Swal.fire('Error', 'No se pudieron cargar los eventos', 'error');
            }
        },
        eventDisplay: 'block',
        eventTimeFormat: {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        },
        height: 'parent',
        contentHeight: 'auto',
        aspectRatio: 1.35,
        expandRows: true,
        initialDate: new Date(),
        eventDidMount: function (info) {
            const categoriaColor = info.event.extendedProps.categoriaColor;
            if (categoriaColor) {
                info.el.style.backgroundColor = categoriaColor;
                info.el.style.borderColor = categoriaColor;
                info.el.style.color = getContrastColor(categoriaColor);
            }
        },
        eventClick: function (info) {
            currentEvent = info.event;
            abrirModalEdicion(info.event);
        },
        dateClick: function (info) {
            if (puedeCrear) {
                try {
                    const startInput = document.getElementById('eventStart');
                    const endInput = document.getElementById('eventEnd');

                    if (startInput && endInput) {
                        startInput.value = info.dateStr + 'T08:00';
                        endInput.value = info.dateStr + 'T09:00';
                        document.getElementById('eventForm')?.scrollIntoView({ behavior: 'smooth' });
                    } else {
                        console.error('No se encontraron los inputs de fecha');
                    }
                } catch (error) {
                    console.error('Error en dateClick:', error);
                }
            }
        }
    });

    // Renderizar calendario
    calendar.render();

    // ==================== MANEJADORES DE EVENTOS ====================
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            try {
                calendar.updateSize();
                calendar.render();
            } catch (error) {
                console.error('Error al actualizar tamaño:', error);
            }
        }, 250);
    });

    // ==================== FUNCIONES PRINCIPALES ====================
    function abrirModalEdicion(event) {
        const modal = document.getElementById('editModal');
        if (!modal) {
            console.error('No se encontró el modal de edición');
            return;
        }

        const creadoPor = event.extendedProps.creadoPor;
        const esCreador = creadoPor === document.getElementById('userName')?.innerText;

        // Verificar permisos
        const puedeEditarEsteEvento = (puedeEditar && (esCreador || userRole === 'SuperAdmin' || userRole === 'SecretarioInstitucion'));
        const puedeEliminarEsteEvento = (puedeEliminar && (esCreador || userRole === 'SuperAdmin' || userRole === 'SecretarioInstitucion'));

        // Verificar categorías
        const categoriasSelect = document.getElementById('editEventCategory');
        if (!categoriasSelect || categoriasSelect.options.length <= 0) {
            Swal.fire('Error', 'No hay categorías disponibles', 'error');
            return;
        }

        if (puedeEditarEsteEvento || puedeEliminarEsteEvento) {
            document.getElementById('editFormContainer').style.display = 'block';
            document.getElementById('accessDeniedContainer').style.display = 'none';

            // Llenar formulario
            document.getElementById('editEventId').value = event.id;
            document.getElementById('editEventTitle').value = event.title;
            document.getElementById('editEventStart').value = formatDateTimeForInput(event.start);
            document.getElementById('editEventEnd').value = event.end ? formatDateTimeForInput(event.end) : formatDateTimeForInput(event.start);
            document.getElementById('editEventDescription').value = event.extendedProps.descripcion || '';
            document.getElementById('editEventCategory').value = event.extendedProps.categoriaId;
            document.getElementById('editEventCreadoPor').value = creadoPor;

            // Mostrar/ocultar botones según permisos
            document.getElementById('btnActualizar').style.display = puedeEditarEsteEvento ? 'inline-block' : 'none';
            document.getElementById('btnEliminar').style.display = puedeEliminarEsteEvento ? 'inline-block' : 'none';
        } else {
            document.getElementById('editFormContainer').style.display = 'none';
            document.getElementById('accessDeniedContainer').style.display = 'block';
        }

        modal.style.display = 'block';
    }

    function formatDateTimeForInput(date) {
        if (!date) return '';
        return date.toISOString().slice(0, 16);
    }

    function getContrastColor(hexColor) {
        // Función para determinar si el color es claro u oscuro
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }

    // ==================== MANEJADORES DE MODAL ====================
    window.closeModal = function () {
        const modal = document.getElementById('editModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    document.querySelector('.close')?.addEventListener('click', closeModal);

    window.addEventListener('click', function (event) {
        if (event.target === document.getElementById('editModal')) {
            closeModal();
        }
    });

    // ==================== MANEJADORES DE FORMULARIOS ====================
    document.getElementById('createEventForm')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const categoriaSelect = document.getElementById('eventCategory');
        if (!categoriaSelect || categoriaSelect.value === '') {
            Swal.fire('Error', 'Debe seleccionar una categoría', 'error');
            return;
        }

        const categoriaColor = categoriaSelect.options[categoriaSelect.selectedIndex]?.dataset.color || '#3788d8';

        const evento = {
            Titulo: document.getElementById('eventTitle').value,
            FechaInicio: document.getElementById('eventStart').value,
            FechaFin: document.getElementById('eventEnd').value,
            Descripcion: document.getElementById('eventDescription').value,
            CategoriaId: categoriaSelect.value
        };

        fetch('/Calendario/Crear', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(evento)
        })
            .then(async response => {
                if (response.ok) {
                    return response.json();
                }
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al crear evento');
            })
            .then(data => {
                Swal.fire('Éxito', data.message || 'Evento creado correctamente', 'success');
                calendar.refetchEvents();
                this.reset();
            })
            .catch(error => {
                Swal.fire('Error', error.message || 'No se pudo crear el evento', 'error');
                console.error('Error:', error);
            });
    });

    document.getElementById('editEventForm')?.addEventListener('submit', function (e) {
        e.preventDefault();

        const evento = {
            Id: document.getElementById('editEventId').value,
            Titulo: document.getElementById('editEventTitle').value,
            FechaInicio: document.getElementById('editEventStart').value,
            FechaFin: document.getElementById('editEventEnd').value,
            Descripcion: document.getElementById('editEventDescription').value,
            CategoriaId: document.getElementById('editEventCategory').value
        };

        fetch('/Calendario/Actualizar?id=' + evento.Id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(evento)
        })
            .then(response => {
                if (response.ok) {
                    Swal.fire('Éxito', 'Evento actualizado correctamente', 'success');
                    calendar.refetchEvents();
                    closeModal();
                } else if (response.status === 403) {
                    Swal.fire('Error', 'No tienes permisos para editar este evento', 'error');
                } else {
                    throw new Error('Error al actualizar evento');
                }
            })
            .catch(error => {
                Swal.fire('Error', 'No se pudo actualizar el evento', 'error');
                console.error('Error:', error);
            });
    });

    // ==================== FUNCIONES DE EVENTOS ====================
    window.deleteEvent = function () {
        if (!currentEvent) return;

        Swal.fire({
            title: '¿Eliminar evento?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                fetch('/Calendario/Eliminar?id=' + currentEvent.id, {
                    method: 'POST'
                })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire('Éxito', 'Evento eliminado correctamente', 'success');
                            calendar.refetchEvents();
                            closeModal();
                        } else if (response.status === 403) {
                            Swal.fire('Error', 'No tienes permisos para eliminar este evento', 'error');
                        } else {
                            throw new Error('Error al eliminar evento');
                        }
                    })
                    .catch(error => {
                        Swal.fire('Error', 'No se pudo eliminar el evento', 'error');
                        console.error('Error:', error);
                    });
            }
        });
    };

    window.clearForm = function () {
        const form = document.getElementById('createEventForm');
        if (form) {
            form.reset();
        }
    };

    // ==================== CARGA DE EVENTOS ====================
    function cargarListaEventos() {
        fetch('/Calendario/Listar')
            .then(response => {
                if (!response.ok) throw new Error('Error en la respuesta del servidor');
                return response.json();
            })
            .then(data => {
                if (!Array.isArray(data)) {
                    throw new Error('Formato de datos inválido');
                }

                const eventsList = document.getElementById('eventsList');
                if (!eventsList) return;

                eventsList.innerHTML = '';

                if (data.length === 0) {
                    eventsList.innerHTML = '<p class="no-events">No hay eventos programados</p>';
                    return;
                }

                data.forEach(evento => {
                    const eventElement = document.createElement('div');
                    eventElement.className = 'event-item';
                    eventElement.innerHTML = `
                        <div class="event-color" style="background-color: ${evento.categoria?.colorHex || '#ccc'}"></div>
                        <div class="event-details">
                            <h4>${evento.title}</h4>
                            <p class="event-date">${new Date(evento.start).toLocaleString()}</p>
                            <p class="event-category">${evento.categoria?.nombre || 'Sin categoría'}</p>
                        </div>
                    `;
                    eventsList.appendChild(eventElement);
                });
            })
            .catch(error => {
                console.error('Error al cargar eventos:', error);
                const eventsList = document.getElementById('eventsList');
                if (eventsList) {
                    eventsList.innerHTML = `
                        <div class="alert alert-error">
                            <strong>Error:</strong> No se pudieron cargar los eventos. 
                            <button onclick="cargarListaEventos()">Reintentar</button>
                        </div>
                    `;
                }
            });
    }

    // ==================== INICIALIZACIÓN FINAL ====================
    cargarListaEventos();
    calendar.on('eventsSet', cargarListaEventos);
});