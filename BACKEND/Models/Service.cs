using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models
{
    public class Service
    {
        [Key]
        public int ServiceId { get; set; }
        
        [Required]
        public string ServiceName { get; set; }
        
        public string ServiceDescription { get; set; }
    }
}
