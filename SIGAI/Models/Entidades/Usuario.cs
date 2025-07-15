using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace SIGAI.Models.Entidades
{
    public class Usuario : IdentityUser
    {
        public required string Nombre { get; set; }
        public required string Apellido { get; set; }    
        public required string DNI { get; set; }  // Login principal
        public DateTime FechaNacimiento { get; set; }
        public required string Nacionalidad { get; set; }
        public required string LugarResidencia { get; set; } // Ciudad de residencia 
        public string? Celular { get; set; } // Teléfono celular 
        public string? FotoPerfil { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now; 
        public DateTime? FechaBaja { get; set; } // Fecha de dado de baja el usuario (no se elimina en la base de datos solo se marca como inactivo, no podra utilizar el sistema) 
        public bool EstaActivo { get; set; } = true;

        // Edad calculada dinámicamente (no se guarda en base de datos)
        public int Edad => CalcularEdad();

        private int CalcularEdad()
        {
            var hoy = DateTime.Today;
            var edad = hoy.Year - FechaNacimiento.Year;
            if (FechaNacimiento > hoy.AddYears(-edad))
                edad--;

            return edad;
        }

        public string NombreCompleto => $"{Nombre} {Apellido}";
    }
}
