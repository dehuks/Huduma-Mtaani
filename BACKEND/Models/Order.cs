using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Order
    {
        [Key]
        public int OrderId { get; set; }
        
        public int? ServiceProviderId { get; set; }
        public int? CustomerId { get; set; }
        
        [Required]
        public string Status { get; set; } = "pending";
        
        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }
        
        public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedOn { get; set; } = DateTime.UtcNow;
        
        [ForeignKey("ServiceProviderId")]
        public virtual ServiceProvider ServiceProvider { get; set; }
        
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; }
    }
}
