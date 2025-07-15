namespace SIGAI.Models.ViewModels
{
    public class DashboardSuperAdminViewModel
    {
        public int TotalUsuarios { get; set; }
        public int TotalEstudiantes { get; set; }
        public int TotalDocentes { get; set; }
        public int TicketsPendientes { get; set; }

        public List<string> ActividadReciente { get; set; } = new();
        public List<string> SolicitudesPendientes { get; set; } = new();
    }

}
