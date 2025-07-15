using Microsoft.AspNetCore.Identity;

namespace SIGAI.Models.Entidades
{
    public class Rol : IdentityRole
    {
        public string? Descripcion { get; set; }
    }
}



