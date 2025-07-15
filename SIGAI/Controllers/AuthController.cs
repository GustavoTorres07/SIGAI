using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using SIGAI.Models.Entidades;
using SIGAI.Models.ViewModels;
using SIGAI.Services.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SIGAI.Controllers
{
    public class AuthController : Controller
    {
        private readonly SignInManager<Usuario> _signInManager;
        private readonly UserManager<Usuario> _userManager;
        private readonly IAuditoriaServicio _auditoriaServicio;

        public AuthController(
            SignInManager<Usuario> signInManager,
            UserManager<Usuario> userManager,
            IAuditoriaServicio auditoriaServicio)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _auditoriaServicio = auditoriaServicio;
        }

        [HttpGet]
        public IActionResult Login()
        {
            if (User.Identity?.IsAuthenticated == true)
                return RedirectToAction("RedireccionarDashboard", "Auth");

            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Login(LoginViewModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var user = await _userManager.FindByNameAsync(model.DNI);

            if (user == null || !user.EstaActivo)
            {
                await _auditoriaServicio.RegistrarAccionAsync(
                    $"Intento de login fallido para DNI {model.DNI} - Usuario no encontrado o inactivo",
                    User);
                ModelState.AddModelError(string.Empty, "Credenciales incorrectas.");
                return View(model);
            }

            var result = await _signInManager.PasswordSignInAsync(
                model.DNI,
                model.Password,
                model.RememberMe,
                lockoutOnFailure: true);

            if (result.Succeeded)
            {
                await _auditoriaServicio.RegistrarAccionAsync(
                    $"Inicio de sesión exitoso para usuario {user.NombreCompleto} (DNI: {user.DNI})",
                    User);

                return RedirectToAction("RedireccionarDashboard", "Auth");
            }

            if (result.IsLockedOut)
            {
                await _auditoriaServicio.RegistrarAccionAsync(
                    $"Cuenta bloqueada temporalmente para usuario {user.NombreCompleto} (DNI: {user.DNI})",
                    User);
                ModelState.AddModelError(string.Empty, "Cuenta bloqueada temporalmente.");
                return View(model);
            }

            await _auditoriaServicio.RegistrarAccionAsync(
                $"Intento de login fallido para usuario {user.NombreCompleto} (DNI: {user.DNI}) - Contraseña incorrecta",
                User);

            ModelState.AddModelError(string.Empty, "Credenciales incorrectas.");
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Logout()
        {
            var dni = User.FindFirstValue("DNI") ?? "Usuario desconocido";
            var nombre = User.Identity?.Name ?? "Usuario desconocido";
            var rol = User.FindFirstValue(ClaimTypes.Role) ?? "Rol desconocido";

            await _auditoriaServicio.RegistrarAccionAsync(
                $"Cierre de sesión - Usuario: {nombre}, DNI: {dni}, Rol: {rol}",
                User);

            await _signInManager.SignOutAsync();
            return RedirectToAction("Login", "Auth"); // Redirige al login
        }

        [HttpGet]
        public async Task<IActionResult> AccessDenied()
        {
            await _auditoriaServicio.RegistrarAccionAsync(
                $"Acceso denegado para usuario {(User.Identity?.IsAuthenticated == true ? User.Identity.Name : "Usuario no registrado")}",
                User);

            TempData["AccesoDenegado"] = true;
            return RedirectToAction("Login");
        }

        [HttpGet]
        public async Task<IActionResult> RedireccionarDashboard()
        {
            var usuario = await _userManager.GetUserAsync(User);
            if (usuario == null) return RedirectToAction("Login");

            var roles = await _userManager.GetRolesAsync(usuario);

            if (roles.Contains("SuperAdmin"))
                return RedirectToAction("Index", "DashboardSuperAdmin");

            if (roles.Contains("SecretarioInstitucion"))
                return RedirectToAction("Index", "DashboardSecretario");

            if (roles.Contains("Docente"))
                return RedirectToAction("Index", "DashboardDocente");

            if (roles.Contains("Estudiante"))
                return RedirectToAction("Index", "DashboardEstudiante");

            // Rol genérico
            return RedirectToAction("Index", "DashboardGenerico");
        }
    }
}
