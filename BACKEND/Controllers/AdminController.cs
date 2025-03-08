using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BACKEND.DTOs;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace BACKEND.Controllers
{
    [Route("api/admin")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly HudumaDbContext _context;
        private readonly JwtService _jwtService;

        public AdminController(HudumaDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("register")]
        [Authorize(Roles = "Admin")] // Only existing admins can create new admins
        public async Task<ActionResult<AdminResponseDto>> RegisterAdmin(AdminDto adminDto)
        {
            if (await _context.Admins.AnyAsync(a => a.Email == adminDto.Email))
            {
                return BadRequest("Email already exists");
            }

            // Hash password
            string passwordHash = HashPassword(adminDto.Password);

            var admin = new Admin
            {
                FullName = adminDto.FullName,
                Email = adminDto.Email,
                Phone = adminDto.Phone,
                PasswordHash = passwordHash
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            return new AdminResponseDto
            {
                AdminId = admin.AdminId,
                FullName = admin.FullName,
                Email = admin.Email,
                Phone = admin.Phone
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponseDto>> AdminLogin(AdminLoginDto loginDto)
        {
            // Hash the provided password for comparison
            string passwordHash = HashPassword(loginDto.Password);

            // Check for admin
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a => a.Email == loginDto.Email);

            if (admin != null)
            {
                // Verify password hash matches
                if (passwordHash == admin.PasswordHash)
                {
                    var token = _jwtService.GenerateToken(admin.AdminId, admin.Email, "Admin");
                    return new AuthResponseDto
                    {
                        Token = token,
                        Role = "Admin",
                        UserId = admin.AdminId
                    };
                }
            }

            // If we get here, either the admin wasn't found or the password was wrong
            return Unauthorized("Invalid credentials");
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AdminResponseDto>>> GetAllAdmins()
        {
            var admins = await _context.Admins.ToListAsync();
            
            return admins.Select(a => new AdminResponseDto
            {
                AdminId = a.AdminId,
                FullName = a.FullName,
                Email = a.Email,
                Phone = a.Phone
            }).ToList();
        }

        [HttpGet("{adminId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AdminResponseDto>> GetAdmin(int adminId)
        {
            var admin = await _context.Admins.FindAsync(adminId);

            if (admin == null)
            {
                return NotFound();
            }

            return new AdminResponseDto
            {
                AdminId = admin.AdminId,
                FullName = admin.FullName,
                Email = admin.Email,
                Phone = admin.Phone
            };
        }

        [HttpPut("{adminId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateAdmin(int adminId, AdminDto adminDto)
        {
            var admin = await _context.Admins.FindAsync(adminId);

            if (admin == null)
            {
                return NotFound();
            }

            // Update admin properties
            admin.FullName = adminDto.FullName;
            admin.Email = adminDto.Email;
            admin.Phone = adminDto.Phone;

            // Update password if provided
            if (!string.IsNullOrEmpty(adminDto.Password))
            {
                admin.PasswordHash = HashPassword(adminDto.Password);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{adminId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAdmin(int adminId)
        {
            var admin = await _context.Admins.FindAsync(adminId);

            if (admin == null)
            {
                return NotFound();
            }

            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}