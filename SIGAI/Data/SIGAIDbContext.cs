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

        // DbSets para tus entidades
        public new DbSet<Usuario> Usuarios { get; set; } = null!;
        public new DbSet<Rol> Roles { get; set; } = null!;
        public DbSet<Auditoria> Auditorias { get; set; } = null!;
        public DbSet<Carrera> Carreras { get; set; } = null!;
        public DbSet<Ticket> Tickets { get; set; } = null!;
        public DbSet<Reporte> Reportes { get; set; } = null!;
        public DbSet<Notificacion> Notificaciones { get; set; } = null!;




        // Puedes agregar más DbSets para otras entidades aquí

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aquí puedes agregar configuraciones adicionales si necesitas
            // Ejemplo: modelBuilder.Entity<Usuario>().HasIndex(u => u.DNI).IsUnique();
        }
    }
}
