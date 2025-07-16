using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIGAI.Data;
using SIGAI.Models.Entidades;
using System.Security.Claims;

namespace SIGAI.Controllers
{
    [Authorize]
    public class CalendarioController : Controller
    {
        private readonly SIGAIDbContext _context;
        private readonly ILogger<CalendarioController> _logger;

        public CalendarioController(SIGAIDbContext context, ILogger<CalendarioController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public IActionResult Index()
        {
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var userName = User.Identity?.Name;

            // Log para diagnóstico
            _logger.LogInformation($"Usuario: {userName}, Rol: {userRole}");

            ViewBag.UserRole = userRole;

            // Pasar permisos a la vista
            ViewBag.PuedeCrear = User.IsInRole("SuperAdmin") || User.IsInRole("Docente") || User.IsInRole("SecretarioInstitucion");
            ViewBag.PuedeEditar = User.IsInRole("SuperAdmin") || User.IsInRole("Docente") || User.IsInRole("SecretarioInstitucion");
            ViewBag.PuedeEliminar = User.IsInRole("SuperAdmin") || User.IsInRole("SecretarioInstitucion");

            // Log de permisos para diagnóstico
            _logger.LogInformation($"Permisos - Crear: {ViewBag.PuedeCrear}, Editar: {ViewBag.PuedeEditar}, Eliminar: {ViewBag.PuedeEliminar}");

            ViewBag.Categorias = _context.CategoriasCalendario.ToList();
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Listar()
        {
            try
            {
                var eventos = await _context.EventosCalendario
                    .Include(e => e.Categoria)
                    .Select(e => new
                    {
                        id = e.Id,
                        title = e.Titulo,
                        start = e.FechaInicio.ToString("o"), // Formato ISO
                        end = e.FechaFin.ToString("o"),     // Formato ISO
                        description = e.Descripcion,
                        categoriaId = e.CategoriaId,
                        categoriaColor = e.Categoria != null ? e.Categoria.ColorHex : "#3788d8",
                        creadoPor = e.CreadoPor,
                        categoria = e.Categoria != null ? new
                        {
                            nombre = e.Categoria.Nombre,
                            colorHex = e.Categoria.ColorHex
                        } : null,
                        extendedProps = new
                        {
                            descripcion = e.Descripcion,
                            categoriaId = e.CategoriaId,
                            categoriaColor = e.Categoria != null ? e.Categoria.ColorHex : "#3788d8",
                            creadoPor = e.CreadoPor
                        }
                    })
                    .ToListAsync();

                return Json(eventos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al listar eventos");
                return StatusCode(500, "Error al cargar eventos");
            }
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Docente,SecretarioInstitucion")]
        public async Task<IActionResult> Crear([FromBody] EventoCalendario evento)
        {
            try
            {
                var userName = User.Identity?.Name;
                var userRole = User.FindFirstValue(ClaimTypes.Role);

                _logger.LogInformation($"Intento de crear evento por usuario: {userName}, rol: {userRole}");
                _logger.LogInformation($"Datos del evento: {System.Text.Json.JsonSerializer.Serialize(evento)}");

                // Verificar que el usuario tiene permisos
                if (!User.IsInRole("SuperAdmin") && !User.IsInRole("Docente") && !User.IsInRole("SecretarioInstitucion"))
                {
                    _logger.LogWarning($"Usuario {userName} sin permisos intentó crear evento");
                    return Forbid("No tienes permisos para crear eventos");
                }

                // Validar modelo
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                    _logger.LogWarning($"Modelo inválido: {string.Join(", ", errors)}");
                    return BadRequest(new { errors = errors });
                }

                // Validar que los campos requeridos no estén vacíos
                if (string.IsNullOrWhiteSpace(evento.Titulo))
                {
                    return BadRequest(new { error = "El título es requerido" });
                }

                if (string.IsNullOrWhiteSpace(evento.CategoriaId))
                {
                    return BadRequest(new { error = "La categoría es requerida" });
                }

                if (evento.FechaFin < evento.FechaInicio)
                {
                    return BadRequest(new { error = "La fecha de fin debe ser igual o posterior a la fecha de inicio" });
                }

                // Validar que la categoría existe
                var categoriaExiste = await _context.CategoriasCalendario
                    .AnyAsync(c => c.Id == evento.CategoriaId);

                if (!categoriaExiste)
                {
                    _logger.LogError($"Categoría no encontrada: {evento.CategoriaId}");
                    var categoriasDisponibles = await _context.CategoriasCalendario
                        .Select(c => new { c.Id, c.Nombre })
                        .ToListAsync();
                    _logger.LogInformation($"Categorías disponibles: {System.Text.Json.JsonSerializer.Serialize(categoriasDisponibles)}");
                    return BadRequest(new { error = "La categoría seleccionada no existe" });
                }

                // Crear evento
                evento.Id = Guid.NewGuid().ToString();
                evento.CreadoPor = userName ?? "Usuario desconocido";

                // Limpiar la referencia de navegación para evitar problemas de EF
                evento.Categoria = null;

                _context.EventosCalendario.Add(evento);
                await _context.SaveChangesAsync();

                _logger.LogInformation($"Evento creado exitosamente con ID: {evento.Id}");

                return Ok(new
                {
                    id = evento.Id,
                    message = "Evento creado exitosamente"
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al crear evento");
                return StatusCode(500, new { error = $"Error interno del servidor: {ex.Message}" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,Docente,SecretarioInstitucion")]
        public async Task<IActionResult> Actualizar(string id, [FromBody] EventoCalendario model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var errors = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage));
                    return BadRequest(new { errors = errors });
                }

                var userName = User.Identity?.Name ?? throw new UnauthorizedAccessException("Usuario no autenticado");
                var evento = await _context.EventosCalendario.FindAsync(id);

                if (evento == null)
                {
                    return NotFound(new { error = "Evento no encontrado" });
                }

                // Validar permisos de edición
                bool puedeEditar = User.IsInRole("SuperAdmin") ||
                                  User.IsInRole("SecretarioInstitucion") ||
                                  (User.IsInRole("Docente") && evento.CreadoPor == userName);

                if (!puedeEditar)
                {
                    return Forbid();
                }

                if (evento.FechaFin < evento.FechaInicio)
                {
                    return BadRequest(new { error = "La fecha de fin debe ser igual o posterior a la fecha de inicio" });
                }

                evento.Titulo = model.Titulo;
                evento.FechaInicio = model.FechaInicio;
                evento.FechaFin = model.FechaFin;
                evento.Descripcion = model.Descripcion;
                evento.CategoriaId = model.CategoriaId;

                _context.EventosCalendario.Update(evento);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Evento actualizado correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al actualizar evento");
                return StatusCode(500, new { error = $"Error al actualizar el evento: {ex.Message}" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "SuperAdmin,SecretarioInstitucion,Docente")]
        public async Task<IActionResult> Eliminar(string id)
        {
            try
            {
                var userName = User.Identity?.Name ?? throw new UnauthorizedAccessException("Usuario no autenticado");
                var evento = await _context.EventosCalendario.FindAsync(id);

                if (evento == null)
                {
                    return NotFound(new { error = "Evento no encontrado" });
                }

                // Validar permisos de eliminación
                bool puedeEliminar = User.IsInRole("SuperAdmin") ||
                                    User.IsInRole("SecretarioInstitucion") ||
                                    (User.IsInRole("Docente") && evento.CreadoPor == userName);

                if (!puedeEliminar)
                {
                    return Forbid();
                }

                _context.EventosCalendario.Remove(evento);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Evento eliminado correctamente" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al eliminar evento");
                return StatusCode(500, new { error = $"Error al eliminar el evento: {ex.Message}" });
            }
        }

        // Método para diagnóstico
        [HttpGet]
        public IActionResult DiagnosticoPermisos()
        {
            var userName = User.Identity?.Name;
            var userRole = User.FindFirstValue(ClaimTypes.Role);
            var claims = User.Claims.Select(c => new { c.Type, c.Value }).ToList();

            var diagnostico = new
            {
                Usuario = userName,
                Rol = userRole,
                Claims = claims,
                Permisos = new
                {
                    PuedeCrear = User.IsInRole("SuperAdmin") || User.IsInRole("Docente") || User.IsInRole("SecretarioInstitucion"),
                    PuedeEditar = User.IsInRole("SuperAdmin") || User.IsInRole("Docente") || User.IsInRole("SecretarioInstitucion"),
                    PuedeEliminar = User.IsInRole("SuperAdmin") || User.IsInRole("SecretarioInstitucion"),
                    EsSuperAdmin = User.IsInRole("SuperAdmin"),
                    EsDocente = User.IsInRole("Docente"),
                    EsSecretario = User.IsInRole("SecretarioInstitucion")
                }
            };

            return Json(diagnostico);
        }
    }
}