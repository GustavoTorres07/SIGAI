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

        // Entidades del sistema
        public DbSet<Usuario> Usuarios { get; set; }
        public new DbSet<Rol> Roles { get; set; }
        public DbSet<Auditoria> Auditorias { get; set; }

        // Entidades del calendario
        public DbSet<CategoriaCalendarioEvento> CategoriasCalendario { get; set; }
        public DbSet<EventoCalendario> EventosCalendario { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Aquí puedes agregar configuraciones adicionales si es necesario

            // Seed inicial de categorías del calendario
            modelBuilder.Entity<CategoriaCalendarioEvento>().HasData(
                new CategoriaCalendarioEvento
                {
                    Id = "1",
                    Nombre = "Académico",
                    ColorHex = "#1976d2"
                },
                new CategoriaCalendarioEvento
                {
                    Id = "2",
                    Nombre = "Administrativo",
                    ColorHex = "#7b1fa2"
                },
                new CategoriaCalendarioEvento
                {
                    Id = "3",
                    Nombre = "Evento",
                    ColorHex = "#388e3c"
                },
                new CategoriaCalendarioEvento
                {
                    Id = "4",
                    Nombre = "Feriado",
                    ColorHex = "#f57c00"
                }
            );
        }
    }
}