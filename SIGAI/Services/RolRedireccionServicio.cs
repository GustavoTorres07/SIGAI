using Microsoft.Extensions.Options;
using SIGAI.Configuracion;
using SIGAI.Services.Interfaces;

namespace SIGAI.Services
{
    public class RolRedireccionServicio : IRolRedireccionServicio
    {
        private readonly DashboardOptions _dashboardOptions;

        public RolRedireccionServicio(IOptions<DashboardOptions> options)
        {
            _dashboardOptions = options.Value;
        }

        public string ObtenerRutaRedireccion(string rol)
        {
            var ruta = _dashboardOptions.Rutas.FirstOrDefault(r => r.Rol == rol);

            if (ruta == null)
                return "/DashboardGenerico/Index";

            var controlador = ruta.Controlador ?? "Dashboard";
            var accion = ruta.Accion ?? "Index";
            var area = ruta.Area;

            return area == null
                ? $"/{controlador}/{accion}"
                : $"/{area}/{controlador}/{accion}";
        }
    }
}
