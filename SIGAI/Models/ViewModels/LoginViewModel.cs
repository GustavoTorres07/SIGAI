using System.ComponentModel.DataAnnotations;

namespace SIGAI.Models.ViewModels
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Ingrese su número de DNI")]
        [StringLength(8, MinimumLength = 8, ErrorMessage = "El DNI debe tener exactamente 8 números")]
        [RegularExpression(@"^\d{8}$", ErrorMessage = "El DNI debe contener solo números")]
        public string DNI { get; set; }

        [Required(ErrorMessage = "Ingrese su contraseña")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Recordarme")]
        public bool RememberMe { get; set; }
    }
}
