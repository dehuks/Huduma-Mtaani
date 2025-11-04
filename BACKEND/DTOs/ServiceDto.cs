using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class ServiceDto
    {
        public string ServiceName { get; set; }
        public string ServiceDescription { get; set; }
    }

     public class PaymentDto
    {
        [Required]
        public int OrderId { get; set; }

        [Required]
        public string Status { get; set; }
        
        [Required]
        public decimal Amount { get; set; } // FIX: Added Amount
        
        public string PaymentMethod { get; set; } // e.g., "MobileMoney"
        
        public string TransactionId { get; set; } // From payment provider
    }

     public class PaymentResponseDto
    {
        public int PaymentId { get; set; }
        public int OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Status { get; set; }
        public DateTime PaymentDate { get; set; }
    }

    public class RatingDto
    {
        [Required]
        [Range(1, 5)]
        public int Rate { get; set; }

        [Required]
        public int OrderId { get; set; } // FIX: Added OrderId

        public string Review { get; set; } // FIX: Added Review
    }
}