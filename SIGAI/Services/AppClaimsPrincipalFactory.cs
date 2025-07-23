using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Threading.Tasks;
using SIGAI.Models.Entidades;

namespace SIGAI.Services
{
    public class AppClaimsPrincipalFactory : UserClaimsPrincipalFactory<Usuario, Rol>
    {
        private readonly UserManager<Usuario> _userManager;

        public AppClaimsPrincipalFactory(
            UserManager<Usuario> userManager,
            RoleManager<Rol> roleManager,
            IOptions<IdentityOptions> optionsAccessor)
            : base(userManager, roleManager, optionsAccessor)
        {
            _userManager = userManager;
        }

        protected override async Task<ClaimsIdentity> GenerateClaimsAsync(Usuario user)
        {
            var identity = await base.GenerateClaimsAsync(user);

            if (!string.IsNullOrEmpty(user.DNI) && !identity.HasClaim(c => c.Type == "DNI"))
            {
                identity.AddClaim(new Claim("DNI", user.DNI));
            }

            // Agregar nombre completo como claim
            var nombreCompleto = $"{user.Nombre} {user.Apellido}";
            if (!string.IsNullOrEmpty(nombreCompleto) && !identity.HasClaim(c => c.Type == "FullName"))
            {
                identity.AddClaim(new Claim("FullName", nombreCompleto));
            }

            // Agregar foto de perfil como claim si existe
            if (!string.IsNullOrEmpty(user.FotoPerfil) && !identity.HasClaim(c => c.Type == "FotoPerfil"))
            {
                identity.AddClaim(new Claim("FotoPerfil", user.FotoPerfil));
            }

            // Agregar roles evitando duplicados
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var rol in roles)
            {
                if (!identity.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == rol))
                {
                    identity.AddClaim(new Claim(ClaimTypes.Role, rol));
                }
            }

            return identity;
        }
    }
}
