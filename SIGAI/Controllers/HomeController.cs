using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SIGAI.Models;
using SIGAI.Models.Entidades;
using System.Diagnostics;
using System.Threading.Tasks;

namespace SIGAI.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<Usuario> _userManager;

        public HomeController(
            ILogger<HomeController> logger,
            UserManager<Usuario> userManager)
        {
            _logger = logger;
            _userManager = userManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [Authorize]  // Asegura que solo usuarios autenticados puedan acceder
        public async Task<IActionResult> RedireccionDashboard()
        {
            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return RedirectToAction("Index", "Home");
            }

            var roles = await _userManager.GetRolesAsync(user);

            if (roles.Contains("SuperAdmin"))
                return RedirectToAction("Dashboard", "SuperAdmin");  // Ajustado a tu estructura

            if (roles.Contains("SecretarioInstitucion"))
                return RedirectToAction("Index", "DashboardSecretario");

            if (roles.Contains("Docente"))
                return RedirectToAction("Index", "DashboardDocente");

            if (roles.Contains("Estudiante"))
                return RedirectToAction("Index", "DashboardEstudiante");

            return RedirectToAction("Index", "DashboardGenerico");
        }
    }
}