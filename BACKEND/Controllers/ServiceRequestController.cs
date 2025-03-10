using Microsoft.AspNetCore.Mvc;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BACKEND.Controllers
{
    [Route("api/servicerequests")]
    [ApiController]
    public class ServiceRequestsController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public ServiceRequestsController(HudumaDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ServiceRequest>> CreateServiceRequest(ServiceRequestDto serviceRequestDto)
        {
            var serviceRequest = new ServiceRequest
            {
                CustomerId = serviceRequestDto.CustomerId,
                ServiceId = serviceRequestDto.ServiceId,
                Description = serviceRequestDto.Description
            };

            _context.ServiceRequests.Add(serviceRequest);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceRequest), new { serviceRequestId = serviceRequest.ServiceRequestId }, serviceRequest);
        }

        [HttpGet("{serviceRequestId}")]
        public async Task<ActionResult<ServiceRequest>> GetServiceRequest(int serviceRequestId)
        {
            var request = await _context.ServiceRequests.FindAsync(serviceRequestId);
            if (request == null)
            {
                return NotFound();
            }
            return request;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ServiceRequest>>> GetAllServiceRequests()
        {
            return await _context.ServiceRequests.ToListAsync();
        }

        [HttpPut("{serviceRequestId}")]
        public async Task<IActionResult> UpdateServiceRequest(int serviceRequestId, ServiceRequestDto serviceRequestDto)
        {
            var serviceRequest = await _context.ServiceRequests.FindAsync(serviceRequestId);

            if (serviceRequest == null)
            {
                return NotFound();
            }

            serviceRequest.Description = serviceRequestDto.Description;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpDelete("{serviceRequestId}")]
        public async Task<IActionResult> DeleteServiceRequest(int serviceRequestId)
        {
            var serviceRequest = await _context.ServiceRequests.FindAsync(serviceRequestId);

            if (serviceRequest == null)
            {
                return NotFound();
            }

            _context.ServiceRequests.Remove(serviceRequest);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
