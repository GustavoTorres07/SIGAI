namespace SIGAI.Configuracion
{
    public class RedireccionInfo
    {
        public string Controlador { get; set; } = null!;
        public string Accion { get; set; } = "Index";
        public string? Area { get; set; }
    }
}
