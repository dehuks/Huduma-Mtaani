using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BACKEND.Models
{
    public class Rating
    {
        [Key]
        public int RatingId { get; set; }
        
        public int? CustomerId { get; set; }
        
        [Range(1, 5)]
        public int Rate { get; set; }
        
        [ForeignKey("CustomerId")]
        public virtual Customer Customer { get; set; }
    }
}
