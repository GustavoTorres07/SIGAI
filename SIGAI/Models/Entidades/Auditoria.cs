namespace SIGAI.Models.Entidades
{
    public class Auditoria
    {
        public int Id { get; set; }

        //public int? UsuarioId { get; set; }

        public string? UsuarioId { get; set; }  // Cambiado de int? a string

        public string NombreUsuario { get; set; } = "Usuario no registrado"; // No nullable con valor por defecto
        public string DNI { get; set; } = "Usuario no registrado"; // No nullable, con valor por defecto
        public string Rol { get; set; } = "Usuario no registrado"; // No nullable con valor por defecto

        public string Accion { get; set; }
        public DateTime FechaHora { get; set; } = DateTime.Now;
    }
}
