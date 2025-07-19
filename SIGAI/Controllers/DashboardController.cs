using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace SIGAI.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        public IActionResult Index()
        {
            var roles = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToList();

            return roles switch
            {
                var r when r.Contains("SuperAdmin") => View("DashboardSuperAdmin"),
                var r when r.Contains("Docente") => View("DashboardDocente"),
                var r when r.Contains("Estudiante") => View("DashboardEstudiante"),
                var r when r.Contains("SecretarioInstitucion") => View("DashboardSecretario"),
                _ => View("DashboardGenerico")
            };
        }
    }
}