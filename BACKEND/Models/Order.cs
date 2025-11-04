using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; } // e.g., "PendingPayment", "InProgress", "Completed"
        public DateTime CreatedOn { get; set; }

        // Foreign key for Customer
        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; }

        // Foreign key for ServiceProvider
        public int ServiceProviderId { get; set; }
        [ForeignKey("ServiceProviderId")]
        public virtual ServiceProvider ServiceProvider { get; set; }

        // Foreign key for the originating ServiceRequest
        public int ServiceRequestId { get; set; }
        [ForeignKey("ServiceRequestId")]
        public virtual ServiceRequest ServiceRequest { get; set; }
    }
}
