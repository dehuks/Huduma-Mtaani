using System.ComponentModel.DataAnnotations;
using System;
using System.ComponentModel.DataAnnotations; // --- ADDED THIS ---
using System.ComponentModel.DataAnnotations.Schema; // --- ADDED THIS ---

namespace BACKEND.Models
{
    public class ServiceRequest
    {
        [Key]
        public int ServiceRequestId { get; set; }
        
        public string Description { get; set; }
        
        public string Status { get; set; } // e.g., "PendingProvider", "Accepted", "Rejected"

        // --- FIX: Added all these missing properties ---
        public DateTime RequestedDate { get; set; }

        // Foreign key for Customer
        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; }

        // Foreign key for ServiceProvider
        public int ServiceProviderId { get; set; }
        [ForeignKey("ServiceProviderId")]
        public virtual ServiceProvider ServiceProvider { get; set; }

        // Foreign key for Service
        public int ServiceId { get; set; }
        [ForeignKey("ServiceId")]
        public virtual Service Service { get; set; }
    }
}
