using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models
{
    public class Address
    {
        [Key]
        public int AddressId { get; set; }
        
        [Required]
        public string County { get; set; }
        
        public string BuildingName { get; set; }
        
        public string Street { get; set; }
    }
}
