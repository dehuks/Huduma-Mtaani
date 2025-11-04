using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class ServiceProvider
    {
        [Key]
        public int ServiceProviderId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string PasswordHash { get; set; }

        // --- FIX: Added properties to calculate and store ratings ---
        public double AverageRating { get; set; } = 0;
        public int TotalRatings { get; set; } = 0;

        // Foreign key for Service
        public int? ServiceId { get; set; }
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; }

        // Navigation properties
        public virtual ICollection<ServiceRequest> ServiceRequests { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
        public virtual ICollection<Rating> Ratings { get; set; }
    }
}