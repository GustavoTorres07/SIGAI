using System.ComponentModel.DataAnnotations;

namespace SIGAI.Models.ViewModels
{
    public class LoginViewModel
    {
        [Required(ErrorMessage = "Ingrese su número de DNI")]
        [RegularExpression(@"^\d{8}$", ErrorMessage = "El DNI debe tener exactamente 8 números")]
        public string DNI { get; set; }

        [Required(ErrorMessage = "Ingrese su contraseña")]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [Display(Name = "Recordarme")]
        public bool RememberMe { get; set; }
    }
}
