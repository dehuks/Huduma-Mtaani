using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BACKEND.DTOs;
using BACKEND.Data;
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace BACKEND.Controllers
{
    [Route("api/services")]
    [ApiController]
    public class ServicesController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public ServicesController(HudumaDbContext context)
        {
            _context = context;
        }

        // --- Public Endpoints (No Authorization) ---

        [HttpGet]
        [AllowAnonymous] 
        public async Task<ActionResult<IEnumerable<object>>> GetServices()
        {
            return await _context.Services
                .Select(s => new {
                    s.ServiceId,
                    s.ServiceName,
                    s.ServiceDescription
                })
                .ToListAsync();
        }

        [HttpGet("{id}")]
        [AllowAnonymous] 
        public async Task<ActionResult<object>> GetService(int id)
        {
            var service = await _context.Services
                .Select(s => new {
                    s.ServiceId,
                    s.ServiceName,
                    s.ServiceDescription
                })
                .FirstOrDefaultAsync(s => s.ServiceId == id);

            if (service == null)
            {
                return NotFound();
            }

            return Ok(service);
        }

        // --- NEW ENDPOINT (For Marketplace Model) ---
        [HttpGet("{id}/providers")]
        [AllowAnonymous] // Everyone can browse providers for a service
        public async Task<ActionResult<IEnumerable<ProviderResponseDto>>> GetProvidersForService(int id)
        {
            var providers = await _context.ServiceProviders
                .Where(p => p.ServiceId == id) // Find providers for this service
                .Select(p => new ProviderResponseDto
                {
                    ServiceProviderId = p.ServiceProviderId,
                    FullName = p.FullName,
                    // Calculate average rating on the fly
                    AverageRating = _context.Ratings.Where(r => r.ServiceProviderId == p.ServiceProviderId).Average(r => (double?)r.Rate) ?? 0,
                    // Calculate total ratings
                    TotalRatings = _context.Ratings.Count(r => r.ServiceProviderId == p.ServiceProviderId)
                })
                .ToListAsync();
            
            return Ok(providers);
        }

        // --- Admin-Only Endpoints (Secure) ---

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Service>> CreateService(ServiceDto serviceDto)
        {
            if (await _context.Services.AnyAsync(s => s.ServiceName == serviceDto.ServiceName))
            {
                return BadRequest(new { message = "Service name already exists" });
            }

            var service = new Service
            {
                ServiceName = serviceDto.ServiceName,
                ServiceDescription = serviceDto.ServiceDescription
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetService), new { id = service.ServiceId }, service);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateService(int id, ServiceDto serviceDto)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }
            
            if (await _context.Services.AnyAsync(s => s.ServiceName == serviceDto.ServiceName && s.ServiceId != id))
            {
                return BadRequest(new { message = "Service name already exists" });
            }

            service.ServiceName = serviceDto.ServiceName;
            service.ServiceDescription = serviceDto.ServiceDescription;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Service updated successfully" });
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteService(int id)
        {
            var service = await _context.Services.FindAsync(id);

            if (service == null)
            {
                return NotFound();
            }

            // Add check for safety
            var isInUse = await _context.ServiceProviders.AnyAsync(sp => sp.ServiceId == id) ||
                          await _context.ServiceRequests.AnyAsync(sr => sr.ServiceId == id);
            
            if (isInUse)
            {
                return BadRequest(new { message = "Cannot delete service, it is currently in use by providers or requests." });
            }


            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Service deleted successfully" });
        }
    }
}
