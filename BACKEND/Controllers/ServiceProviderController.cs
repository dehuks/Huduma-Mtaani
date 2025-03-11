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
    [Route("api/service-providers")]
    [ApiController]
    public class ServiceProviderController : ControllerBase
    {
        private readonly HudumaDbContext _context;
        private readonly JwtService _jwtService;

        public ServiceProviderController(HudumaDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // Create Service Provider
        [HttpPost("create")]
        [Authorize(Roles = "Admin")] // Only admin can register service providers
        public async Task<ActionResult<Models.ServiceProvider>> CreateServiceProvider(ServiceProviderDto serviceProviderDto)
        {
            if (await _context.ServiceProviders.AnyAsync(sp => sp.Email == serviceProviderDto.Email))
            {
                return BadRequest("Email already exists");
            }

            // Hash password before storing
            string passwordHash = HashPassword(serviceProviderDto.Password);

            var serviceProvider = new Models.ServiceProvider
            {
                ServiceId = serviceProviderDto.ServiceId,
                FullName = serviceProviderDto.FullName,
                Email = serviceProviderDto.Email,
                Phone = serviceProviderDto.Phone,
                RatingId = serviceProviderDto.RatingId,
                PasswordHash = passwordHash
            };

            _context.ServiceProviders.Add(serviceProvider);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceProviderById), new { serviceProviderId = serviceProvider.ServiceProviderId }, serviceProvider);
        }

        // Get All Service Providers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Models.ServiceProvider>>> GetAllServiceProviders()
        {
            return await _context.ServiceProviders.ToListAsync();
        }

        // Get Service Provider by ID
        [HttpGet("{serviceProviderId}")]
        public async Task<ActionResult<Models.ServiceProvider>> GetServiceProviderById(int serviceProviderId)
        {
            var serviceProvider = await _context.ServiceProviders.FindAsync(serviceProviderId);

            if (serviceProvider == null)
            {
                return NotFound();
            }

            return serviceProvider;
        }

        // Get Service Providers by Service ID
        [HttpGet("service/{serviceId}")]
        public async Task<ActionResult<IEnumerable<Models.ServiceProvider>>> GetServiceProvidersByServiceId(int serviceId)
        {
            var serviceProviders = await _context.ServiceProviders
                .Where(sp => sp.ServiceId == serviceId)
                .ToListAsync();

            if (!serviceProviders.Any())
            {
                return NotFound("No service providers found for this service.");
            }

            return serviceProviders;
        }

        // Update Service Provider
        [HttpPut("{serviceProviderId}")]
        [Authorize(Roles = "Admin, ServiceProvider")]
        public async Task<IActionResult> UpdateServiceProvider(int serviceProviderId, ServiceProviderDto serviceProviderDto)
        {
            var serviceProvider = await _context.ServiceProviders.FindAsync(serviceProviderId);

            if (serviceProvider == null)
            {
                return NotFound();
            }

            serviceProvider.FullName = serviceProviderDto.FullName;
            serviceProvider.Email = serviceProviderDto.Email;
            serviceProvider.Phone = serviceProviderDto.Phone;
            serviceProvider.ServiceId = serviceProviderDto.ServiceId;
            serviceProvider.RatingId = serviceProviderDto.RatingId;

            // Update password if provided
            if (!string.IsNullOrEmpty(serviceProviderDto.Password))
            {
                serviceProvider.PasswordHash = HashPassword(serviceProviderDto.Password);
            }

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Delete Service Provider
        [HttpDelete("{serviceProviderId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteServiceProvider(int serviceProviderId)
        {
            var serviceProvider = await _context.ServiceProviders.FindAsync(serviceProviderId);

            if (serviceProvider == null)
            {
                return NotFound();
            }

            _context.ServiceProviders.Remove(serviceProvider);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Password Hashing Method
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
