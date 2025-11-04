using System.ComponentModel.DataAnnotations;

namespace BACKEND.DTOs
{
    public class SignUpDto
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

        [Required]
        public string Role { get; set; }

        // FIX: This property was missing, causing CS1061
        public int? ServiceId { get; set; }
    }

    public class SignInDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class UserUpdateDto
    {
        // These are nullable because the user might only want to update one field
        public string? FullName { get; set; }

        [EmailAddress]
        public string? Email { get; set; }
        
        [Phone]
        public string? Phone { get; set; }
    }

    public class AuthResponseDto
    {
        [Required]
        public string Token { get; set; }

        [Required]
        public string Role { get; set; }

        public int UserId { get; set; }

        // FIX: This property was missing, causing CS0117
        [Required]
        public string FullName { get; set; }

        // FIX: This property was missing, causing CS0117
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
