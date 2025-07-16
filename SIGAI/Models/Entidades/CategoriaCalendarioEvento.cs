namespace SIGAI.Models.Entidades
{
    public class CategoriaCalendarioEvento
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Nombre { get; set; }
        public string ColorHex { get; set; }
    }
}
