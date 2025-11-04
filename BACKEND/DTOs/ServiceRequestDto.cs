using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class ServiceRequestDto
    {
        [Required]
        public int ServiceId { get; set; }
        
        [Required]
        public int ServiceProviderId { get; set; } // NEW: Customer must choose a provider

        [Required]
        public string Description { get; set; }
    }
}
