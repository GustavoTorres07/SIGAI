using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SIGAI.Models.ViewModels;

namespace SIGAI.Controllers
{
    [Authorize(Roles = "SuperAdmin")]
    public class DashboardSuperAdminController : Controller
    {
        public IActionResult Index()
        {
            var viewModel = new DashboardSuperAdminViewModel
            {
                TotalUsuarios = 125,
                TotalEstudiantes = 90,
                TotalDocentes = 22,
                TicketsPendientes = 4,
                ActividadReciente = new List<string>
                {
                    "Se registró un nuevo estudiante.",
                    "Usuario Juan Pérez cambió su contraseña.",
                    "Se asignó un nuevo rol al docente Laura G."
                },
                SolicitudesPendientes = new List<string>
                {
                    "Solicitud de inscripción: Estudiante Pedro R.",
                    "Cambio de carrera solicitado por María T."
                }
            };

            return View(viewModel);
        }
    }
}
