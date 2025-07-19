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

            if (!string.IsNullOrEmpty(user.DNI))
                identity.AddClaim(new Claim("DNI", user.DNI));

            // Obtener roles y agregarlos como claims
            var roles = await _userManager.GetRolesAsync(user);
            foreach (var rol in roles)
            {
                identity.AddClaim(new Claim(ClaimTypes.Role, rol));
            }

            return identity;
        }
    }
}
