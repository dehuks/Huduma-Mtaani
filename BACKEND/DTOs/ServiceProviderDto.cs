using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class ServiceProviderDto
    {
        public int? ServiceId { get; set; }
        
        [Required]
        public string FullName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [Phone]
        public string Phone { get; set; }
        
        public int? RatingId { get; set; }
        
        public string Password { get; set; }
    }
}