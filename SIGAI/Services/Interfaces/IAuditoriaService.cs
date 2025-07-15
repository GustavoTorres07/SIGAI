using System.Security.Claims;

namespace SIGAI.Services.Interfaces
{
    public interface IAuditoriaServicio
    {
        Task RegistrarAccionAsync(string accion, ClaimsPrincipal usuario);
    }
}
