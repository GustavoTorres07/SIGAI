using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SIGAI.Models.Entidades;

namespace SIGAI.Data
{
    public class SIGAIDbContext : IdentityDbContext<Usuario, Rol, string>
    {
        public SIGAIDbContext(DbContextOptions<SIGAIDbContext> options)
            : base(options)
        {
        }

        public DbSet<Usuario> Usuarios { get; set; }
        public new DbSet<Rol> Roles { get; set; }
        public DbSet<Auditoria> Auditorias { get; set; }

    }
}
