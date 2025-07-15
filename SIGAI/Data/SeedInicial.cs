using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using SIGAI.Models.Entidades;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SIGAI.Data
{
    public static class SeedInicial
    {
        public static async Task InicializarAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetRequiredService<SIGAIDbContext>();
            var userManager = serviceProvider.GetRequiredService<UserManager<Usuario>>();
            var roleManager = serviceProvider.GetRequiredService<RoleManager<Rol>>();

            // Aplicar migraciones pendientes
            await context.Database.MigrateAsync();

            // Crear roles predeterminados
            string[] roles = { "SuperAdmin", "Docente", "Estudiante", "SecretarioInstitucion" };

            foreach (var roleName in roles)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new Rol
                    {
                        Name = roleName,
                        NormalizedName = roleName.ToUpper()
                    });
                }
            }

            // Crear usuario SuperAdmin si no existe
            string dniSuperAdmin = "39054025";
            string emailSuperAdmin = "superadmin@sigai.com";
            string passwordSuperAdmin = "Admin123";

            var superAdmin = await userManager.FindByNameAsync(dniSuperAdmin);

            if (superAdmin == null)
            {
                superAdmin = new Usuario
                {
                    DNI = dniSuperAdmin,
                    UserName = dniSuperAdmin,
                    Email = emailSuperAdmin,
                    Nombre = "Super",
                    Apellido = "Admin",
                    Nacionalidad = "Argentina",
                    LugarResidencia = "Santa Rosa",
                    Celular = "2954216751",
                    EstaActivo = true,
                    FechaNacimiento = new DateTime(1990, 06, 07),
                    EmailConfirmed = true,
                    FechaCreacion = DateTime.Now,
                    LockoutEnabled = false
                };

                var createResult = await userManager.CreateAsync(superAdmin, passwordSuperAdmin);

                if (!createResult.Succeeded)
                {
                    var errors = string.Join("\n", createResult.Errors.Select(e => e.Description));
                    throw new Exception($"Error al crear SuperAdmin:\n{errors}");
                }

                var roleResult = await userManager.AddToRoleAsync(superAdmin, "SuperAdmin");

                if (!roleResult.Succeeded)
                {
                    var errors = string.Join("\n", roleResult.Errors.Select(e => e.Description));
                    throw new Exception($"Error al asignar rol SuperAdmin:\n{errors}");
                }
            }

            await context.SaveChangesAsync();
        }
    }
}
