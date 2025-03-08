using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class AdminDto
    {
        [Required]
        public string FullName { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        [Phone]
        public string Phone { get; set; }
        
        [Required]
        public string Password { get; set; }
    }

    public class AdminResponseDto
    {
        public int AdminId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }

    public class AdminLoginDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Password { get; set; }
    }
}