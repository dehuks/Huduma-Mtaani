using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class ServiceProvider
    {
        [Key]
        public int ServiceProviderId { get; set; }
        
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
        
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; }
        
        [ForeignKey("RatingId")]
        public virtual Rating Rating { get; set; }

         public string PasswordHash { get; set; }
    }
}