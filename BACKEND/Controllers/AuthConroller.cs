using Microsoft.AspNetCore.Mvc;
using BACKEND.DTOs;
using BACKEND.Services;
using BACKEND.Data;
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace BACKEND.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly HudumaDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(HudumaDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        [HttpPost("signup")]
        public async Task<ActionResult<AuthResponseDto>> SignUp(SignUpDto signUpDto)
        {
            if (await _context.Customers.AnyAsync(c => c.Email == signUpDto.Email) ||
                await _context.ServiceProviders.AnyAsync(sp => sp.Email == signUpDto.Email))
            {
                return BadRequest("Email already exists");
            }

            // Hash password
            string passwordHash = HashPassword(signUpDto.Password);

            if (signUpDto.Role.ToLower() == "customer")
            {
                var customer = new Customer
                {
                    CustomerName = signUpDto.FullName,
                    Email = signUpDto.Email,
                    Phone = signUpDto.Phone
                };

                _context.Customers.Add(customer);
                await _context.SaveChangesAsync();

                var token = _jwtService.GenerateToken(customer.CustomerId, customer.Email, "Customer");
                return new AuthResponseDto { Token = token, Role = "Customer", UserId = customer.CustomerId };
            }
            else if (signUpDto.Role.ToLower() == "serviceprovider")
            {
                var serviceProvider = new Models.ServiceProvider
                {
                    FullName = signUpDto.FullName,
                    Email = signUpDto.Email,
                    Phone = signUpDto.Phone
                };

                _context.ServiceProviders.Add(serviceProvider);
                await _context.SaveChangesAsync();

                var token = _jwtService.GenerateToken(serviceProvider.ServiceProviderId, serviceProvider.Email, "ServiceProvider");
                return new AuthResponseDto { Token = token, Role = "ServiceProvider", UserId = serviceProvider.ServiceProviderId };
            }

            return BadRequest("Invalid role specified");
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