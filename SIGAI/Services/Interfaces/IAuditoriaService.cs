using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace SIGAI.Services.Interfaces
{
    public interface IAuditoriaServicio
    {
        // Auditoría para usuarios autenticados
        Task RegistrarAccionAsync(string descripcion, ClaimsPrincipal usuario);

        // Auditoría para usuarios no autenticados
        Task RegistrarAccionAnonimaAsync(string descripcion, HttpContext context);
    }
}
