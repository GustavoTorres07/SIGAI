using Microsoft.AspNetCore.Mvc.Filters;
using SIGAI.Data;
using SIGAI.Models.Entidades;
using System.Security.Claims;

namespace SIGAI.Filters
{
    public class AuditoriaFiltro : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var executedContext = await next();

            try
            {
                var httpContext = context.HttpContext;
                var usuario = httpContext.User;
                var db = httpContext.RequestServices.GetRequiredService<SIGAIDbContext>();

                var accion = $"{context.Controller.GetType().Name} - {context.ActionDescriptor.DisplayName}";

                bool esAutenticado = usuario.Identity?.IsAuthenticated ?? false;

                string? usuarioId = esAutenticado ? usuario.FindFirstValue(ClaimTypes.NameIdentifier) : null;

                var auditoria = new Auditoria
                {
                    FechaHora = DateTime.Now,
                    Accion = accion,
                    UsuarioId = usuarioId,
                    DNI = esAutenticado ? usuario.FindFirstValue("DNI") ?? "Sin DNI" : "Usuario no registrado",
                    NombreUsuario = esAutenticado ? usuario.Identity?.Name ?? "Sin nombre" : "Usuario no registrado",
                    Rol = esAutenticado ? usuario.FindFirstValue(ClaimTypes.Role) ?? "Sin rol" : "Usuario no registrado"
                };

                db.Auditorias.Add(auditoria);
                await db.SaveChangesAsync();
            }
            catch
            {
                // Evitar que falle la acción principal si hay error en auditoría
            }
        }
    }
}
