using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SIGAI.Models;
using SIGAI.Models.Entidades;
using SIGAI.Services.Interfaces;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SIGAI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<Usuario> _userManager;
        private readonly IRolRedireccionServicio _rolRedireccionServicio;

        public HomeController(
            ILogger<HomeController> logger,
            UserManager<Usuario> userManager,
            IRolRedireccionServicio rolRedireccionServicio)
        {
            _logger = logger;
            _userManager = userManager;
            _rolRedireccionServicio = rolRedireccionServicio;
        }

        public IActionResult Index() => View();

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error() =>
            View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });

        [Authorize]
        public async Task<IActionResult> RedireccionDashboard()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                _logger.LogWarning("Intento de acceso sin usuario autenticado a RedireccionDashboard.");
                return RedirectToAction("Index", "Home");
            }

            var roles = await _userManager.GetRolesAsync(user);

            if (roles == null || roles.Count == 0)
            {
                _logger.LogWarning("Usuario {UserId} no tiene roles asignados.", user.Id);
                return RedirectToAction("Index", "Home");
            }

            // Usar el nombre correcto del servicio inyectado
            var url = _rolRedireccionServicio.ObtenerRutaRedireccion(roles[0]);

            return Redirect(url);
        }

    }
}
