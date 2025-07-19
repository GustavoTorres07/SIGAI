namespace SIGAI.Configuracion
{
    public class DashboardRoute
    {
        public string Rol { get; set; } = null!;
        public string Controlador { get; set; } = null!;
        public string Accion { get; set; } = "Index";
        public string? Area { get; set; }
    }
}
