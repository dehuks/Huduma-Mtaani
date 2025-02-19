using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BACKEND.DTOs;
using BACKEND.Data;
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Controllers
{
    [Route("api/services")]
    [ApiController]
    [Authorize]
    public class ServicesController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public ServicesController(HudumaDbContext context)
        {
            _context = context;
        }

        [HttpPost("create")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Service>> CreateService(ServiceDto serviceDto)
        {
            var service = new Service
            {
                ServiceName = serviceDto.ServiceName,
                ServiceDescription = serviceDto.ServiceDescription
            };

            _context.Services.Add(service);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetService), new { serviceId = service.ServiceId }, service);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Service>>> GetServices()
        {
            return await _context.Services.ToListAsync();
        }

        [HttpGet("{serviceId}")]
        public async Task<ActionResult<Service>> GetService(int serviceId)
        {
            var service = await _context.Services.FindAsync(serviceId);

            if (service == null)
            {
                return NotFound();
            }

            return service;
        }

        [HttpPut("{serviceId}/update")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateService(int serviceId, ServiceDto serviceDto)
        {
            var service = await _context.Services.FindAsync(serviceId);

            if (service == null)
            {
                return NotFound();
            }

            service.ServiceName = serviceDto.ServiceName;
            service.ServiceDescription = serviceDto.ServiceDescription;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{serviceId}/delete")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteService(int serviceId)
        {
            var service = await _context.Services.FindAsync(serviceId);

            if (service == null)
            {
                return NotFound();
            }

            _context.Services.Remove(service);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}