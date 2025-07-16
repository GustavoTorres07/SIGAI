using System.ComponentModel.DataAnnotations;

namespace SIGAI.Models.Entidades
{
    public class EventoCalendario
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required(ErrorMessage = "El título es requerido")]
        [StringLength(200, ErrorMessage = "El título no puede exceder 200 caracteres")]
        public string Titulo { get; set; }

        [Required(ErrorMessage = "La fecha de inicio es requerida")]
        public DateTime FechaInicio { get; set; }

        [Required(ErrorMessage = "La fecha de fin es requerida")]
        public DateTime FechaFin { get; set; }

        [StringLength(1000, ErrorMessage = "La descripción no puede exceder 1000 caracteres")]
        public string? Descripcion { get; set; }

        [Required(ErrorMessage = "La categoría es requerida")]
        public string CategoriaId { get; set; }

        // Propiedad de navegación - puede ser null al crear
        public CategoriaCalendarioEvento? Categoria { get; set; }

        [Required]
        public string CreadoPor { get; set; }

        // Validación personalizada para fechas
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            // Cambié aquí el operador para permitir FechaFin igual a FechaInicio
            if (FechaFin < FechaInicio)
            {
                yield return new ValidationResult(
                    "La fecha de fin debe ser igual o posterior a la fecha de inicio",
                    new[] { nameof(FechaFin) }
                );
            }
        }
    }

}
