namespace SIGAI.Models.ViewModels
{
    public class DashboardSuperAdminViewModel
    {
        // Datos del usuario actual
        public string NombreUsuario { get; set; } = "Usuario";
        public string FotoPerfil { get; set; } = "/images/perfil-default.png";

        // Cantidad de notificaciones sin leer para el usuario
        public int CantidadNotificaciones { get; set; } = 0;

        // Totales del sistema (desde base de datos)
        public int TotalUsuarios { get; set; } = 0;
        public int TotalCarreras { get; set; } = 0;
        public int TotalTickets { get; set; } = 0;
        public int TotalReportes { get; set; } = 0;  // Si tienes esta entidad
    }
}
