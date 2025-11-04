using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BACKEND.DTOs;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Services;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace BACKEND.Controllers
{
    [Route("api/provider")]
    [ApiController]
    [Authorize(Roles = "ServiceProvider")]
    public class ServiceProviderController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public ServiceProviderController(HudumaDbContext context)
        {
            _context = context;
        }

        // NOTE: Profile management (GET /me, PUT /me) is handled by AuthController.
        
        // --- 1. Service Request Management (NEW) ---

        [HttpGet("pending-requests")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyPendingRequests()
        {
            var providerId = GetAuthenticatedProviderId();

            var requests = await _context.ServiceRequests
                .Where(sr => sr.ServiceProviderId == providerId && sr.Status == "PendingProvider")
                .OrderByDescending(sr => sr.RequestedDate)
                .Select(sr => new { 
                    sr.ServiceRequestId,
                    sr.Description,
                    sr.Status,
                    sr.RequestedDate,
                    Service = sr.Service.ServiceName,
                    Customer = new { sr.Customer.CustomerName, sr.Customer.Phone }
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpPatch("service-requests/{id}/respond")]
        public async Task<IActionResult> RespondToServiceRequest(int id, [FromBody] ProviderRespondDto respondDto)
        {
            var providerId = GetAuthenticatedProviderId();
            
            var request = await _context.ServiceRequests.FindAsync(id);
            if (request == null) return NotFound(new { message = "Request not found" });
            
            if (request.ServiceProviderId != providerId) return Forbid();

            if (request.Status != "PendingProvider")
            {
                return BadRequest(new { message = "This request has already been actioned." });
            }

            if (respondDto.Accept)
            {
                request.Status = "ProviderAccepted";
                // TODO: Notify customer their request was accepted
            }
            else
            {
                request.Status = "ProviderRejected";
                // TODO: Notify customer their request was rejected
            }
            
            await _context.SaveChangesAsync();
            return Ok(new { message = $"Request has been {request.Status}" });
        }
    

        // --- 2. Order Management ---
        
        [HttpGet("my-orders")]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetMyOrders()
        {
            var providerId = GetAuthenticatedProviderId();

            var orders = await _context.Orders
                .Where(o => o.ServiceProviderId == providerId)
                .OrderByDescending(o => o.CreatedOn)
                .Select(o => new OrderResponseDto
                {
                    OrderId = o.OrderId,
                    Status = o.Status,
                    Amount = o.Amount,
                    CreatedOn = o.CreatedOn
                })
                .ToListAsync();
            
            return Ok(orders);
        }

        [HttpPatch("orders/{orderId}/status")]
        public async Task<IActionResult> UpdateOrderStatus(int orderId, [FromBody] UpdateOrderStatusDto statusDto)
        {
            var providerId = GetAuthenticatedProviderId();

            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound(new { message = "Order not found" });
            }

            if (order.ServiceProviderId != providerId)
            {
                return Forbid(); 
            }

            var newStatus = statusDto.Status.ToLower();
            
            // Simplified status flow:
            // PaymentConfirmed -> InProgress -> Completed
            if (order.Status == "PaymentConfirmed" && newStatus == "inprogress")
            {
                 order.Status = "InProgress";
            }
            else if (order.Status == "InProgress" && newStatus == "completed")
            {
                order.Status = "Completed";
            }
            else
            {
                 return BadRequest(new { message = $"Cannot change status from '{order.Status}' to '{newStatus}'." });
            }

            await _context.SaveChangesAsync();

            return Ok(new { message = "Order status updated successfully", order.Status });
        }


        // --- 3. Rating & Feedback ---

        [HttpGet("my-ratings")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyRatings()
        {
            var providerId = GetAuthenticatedProviderId();

            var ratings = await _context.Ratings
                .Where(r => r.ServiceProviderId == providerId)
                .OrderByDescending(r => r.RatedOn)
                .Select(r => new 
                {
                    r.Rate,
                    r.Review,
                    r.RatedOn,
                    CustomerName = r.Customer.CustomerName,
                    Service = r.Order.ServiceRequest.Service.ServiceName
                })
                .ToListAsync();

            var average = await _context.Ratings
                .Where(r => r.ServiceProviderId == providerId)
                .AverageAsync(r => (double?)r.Rate) ?? 0; 

            return Ok(new {
                AverageRating = average,
                Ratings = ratings
            });
        }


        // --- Helper Methods ---

        private int GetAuthenticatedProviderId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                throw new UnauthorizedAccessException("User ID not found in token.");
            }
            return int.Parse(userIdClaim.Value);
        }
    }
}
