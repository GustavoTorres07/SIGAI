using Microsoft.Extensions.Logging;
using SIGAI.Data;
using SIGAI.Models.Entidades;
using SIGAI.Services.Interfaces;
using System.Security.Claims;
using System.Threading.Tasks;

public class AuditoriaServicio : IAuditoriaServicio
{
    private readonly SIGAIDbContext _context;
    private readonly ILogger<AuditoriaServicio>? _logger;

    public AuditoriaServicio(SIGAIDbContext context, ILogger<AuditoriaServicio>? logger = null)
    {
        _context = context;
        _logger = logger;
    }

    public async Task RegistrarAccionAsync(string accion, ClaimsPrincipal usuario)
    {
        try
        {
            var esAutenticado = usuario.Identity?.IsAuthenticated ?? false;

            string? usuarioId = null;
            var dniUsuario = "Usuario no registrado";
            var nombreUsuario = "Usuario no registrado";
            var rolUsuario = "Usuario no registrado";

            if (esAutenticado)
            {
                usuarioId = usuario.FindFirstValue(ClaimTypes.NameIdentifier); // Aquí ya es string GUID, no parsear a int
                dniUsuario = usuario.FindFirstValue("DNI") ?? "DNI no definido";
                nombreUsuario = usuario.FindFirstValue(ClaimTypes.Name) ?? "Nombre no definido";
                rolUsuario = usuario.FindFirstValue(ClaimTypes.Role) ?? "Rol no definido";
            }

            var auditoria = new Auditoria
            {
                FechaHora = DateTime.Now,
                Accion = accion,
                UsuarioId = usuarioId,
                DNI = dniUsuario,
                NombreUsuario = nombreUsuario,
                Rol = rolUsuario
            };

            _context.Auditorias.Add(auditoria);
            await _context.SaveChangesAsync();
        }
        catch (Exception ex)
        {
            _logger?.LogError(ex, "Error al registrar auditoría.");
        }
    }
}
