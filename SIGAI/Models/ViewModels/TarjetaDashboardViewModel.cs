namespace SIGAI.Models.ViewModels
{
    public class TarjetaDashboardViewModel
    {
        public string Titulo { get; set; }
        public string Descripcion { get; set; }
        public string Icono { get; set; }
        public string Color { get; set; }
        public string Url { get; set; }

        public TarjetaDashboardViewModel(string titulo, string descripcion, string icono, string color, string url)
        {
            Titulo = titulo;
            Descripcion = descripcion;
            Icono = icono;
            Color = color;
            Url = url;
        }
    }
}
