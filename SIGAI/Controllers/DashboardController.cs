using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SIGAI.Data;
using SIGAI.Models.ViewModels;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SIGAI.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private readonly SIGAIDbContext _context;

        public DashboardController(SIGAIDbContext context)
        {
            _context = context;
        }

        public async Task<IActionResult> Index()
        {
            // Obtener roles del usuario actual desde Claims
            var roles = User.FindAll(ClaimTypes.Role)
                            .Select(c => c.Value)
                            .Distinct()
                            .ToList();

            if (!roles.Any())
                return View("DashboardGenerico");

            var primaryRole = roles.First();

            switch (primaryRole)
            {
                case "SuperAdmin":
                    var nombreUsuario = User.FindFirstValue(ClaimTypes.Name) ?? User.Identity?.Name ?? "SuperAdmin";
                    var fotoPerfil = User.FindFirst("FotoPerfil")?.Value ?? "/images/perfil-default.png";
                    var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

                    var viewModel = new DashboardSuperAdminViewModel
                    {
                        NombreUsuario = nombreUsuario,
                        FotoPerfil = fotoPerfil,
                        //CantidadNotificaciones = await _context.Notificaciones
                        //                            .CountAsync(n => !n.Leido && n.UsuarioId == userId),

                        TotalUsuarios = await _context.Usuarios.CountAsync(),
                        TotalCarreras = await _context.Carreras.CountAsync(),
                        TotalTickets = await _context.Tickets.CountAsync(),
                        TotalReportes = await _context.Reportes.CountAsync()
                    };

                    return View("DashboardSuperAdmin", viewModel);

                case "Docente":
                    return View("DashboardDocente");

                case "Estudiante":
                    return View("DashboardEstudiante");

                case "SecretarioInstitucion":
                    return View("DashboardSecretario");

                default:
                    return View("DashboardGenerico");
            }
        }
    }
}
