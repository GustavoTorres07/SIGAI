using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SIGAI.Data;
using SIGAI.Models.Entidades;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SIGAI.Filters
{
    public class AuditoriaFiltro : IAsyncActionFilter
    {
        private readonly ILogger<AuditoriaFiltro> _logger;

        public AuditoriaFiltro(ILogger<AuditoriaFiltro> logger)
        {
            _logger = logger;
        }

        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var executedContext = await next();

            try
            {
                var httpContext = context.HttpContext;
                var usuario = httpContext.User;
                var db = httpContext.RequestServices.GetRequiredService<SIGAIDbContext>();

                string controllerName = context.Controller?.GetType().Name ?? "Controlador desconocido";
                string actionName = context.ActionDescriptor.DisplayName ?? "Acción desconocida";
                string accion = $"{controllerName} - {actionName}";

                bool esAutenticado = usuario.Identity?.IsAuthenticated ?? false;

                string usuarioId = esAutenticado ? usuario.FindFirstValue(ClaimTypes.NameIdentifier) : null!;
                string dni = esAutenticado ? usuario.FindFirstValue("DNI") ?? "Sin DNI" : "Usuario no registrado";
                string nombre = esAutenticado ? usuario.Identity?.Name ?? "Sin nombre" : "Usuario no registrado";
                string rol = esAutenticado ? usuario.FindFirstValue(ClaimTypes.Role) ?? "Sin rol" : "Usuario no registrado";

                var auditoria = new Auditoria
                {
                    FechaHora = DateTime.Now,
                    Accion = accion,
                    UsuarioId = usuarioId,
                    DNI = dni,
                    NombreUsuario = nombre,
                    Rol = rol
                };

                db.Auditorias.Add(auditoria);
                await db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error al registrar auditoría en AuditoriaFiltro");
                // No lanzar excepción para no afectar la ejecución de la acción
            }
        }
    }
}
