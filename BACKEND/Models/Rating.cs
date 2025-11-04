using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Rating
    {
        [Key]
        public int RatingId { get; set; }

        [Range(1, 5)]
        public int Rate { get; set; }

        // --- FIX: Added all these missing properties ---
        public string Review { get; set; }
        public DateTime RatedOn { get; set; }

        // Foreign key for Customer
        public int CustomerId { get; set; }
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; }

        // Foreign key for Order
        public int OrderId { get; set; }
        [ForeignKey("OrderId")]
        public virtual Order Order { get; set; }

        // Foreign key for ServiceProvider
        public int ServiceProviderId { get; set; }
        [ForeignKey("ServiceProviderId")]
        public virtual ServiceProvider ServiceProvider { get; set; }
    }
}
