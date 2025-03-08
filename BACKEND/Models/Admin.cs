using System.ComponentModel.DataAnnotations;

namespace BACKEND.Models 
{
    public class Admin
    {
        [Key]
        public int AdminId { get; set; }
        
        [Required]
        public string FullName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [Phone]
        public string Phone { get; set; }
        
        [Required]
        public string PasswordHash { get; set; }
    }
}