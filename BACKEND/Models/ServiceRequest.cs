using System.ComponentModel.DataAnnotations;
using System;

namespace BACKEND.Models
{
    public class ServiceRequest
    {
        [Key]
        public int ServiceRequestId { get; set; }

        [Required]
        public int CustomerId { get; set; }

        [Required]
        public int ServiceId { get; set; }

        public string Description { get; set; }

        public string Status { get; set; } = "Pending"; // "Pending", "Accepted", "Completed"

        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
    }
}
