using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }

        [Required]
        public string Status { get; set; } // e.g., "Paid", "Pending", "Failed"

        [Required]
        public decimal Amount { get; set; } // <-- FIX: Added this property

        public DateTime PaymentDate { get; set; }

        public string? PaymentMethod { get; set; } // e.g., "MobileMoney", "Card"
        public string? TransactionId { get; set; } // From payment provider

        // Foreign key for Order
        [Required]
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }
    }
}