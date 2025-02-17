using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Payment
    {
        [Key]
        public int PaymentId { get; set; }
        
        public int? OrderId { get; set; }
        
        [Required]
        public string Status { get; set; } = "Not Paid";
        
        public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedOn { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }
    }
}