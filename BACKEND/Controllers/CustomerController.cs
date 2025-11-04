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
    [Route("api/customer")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class CustomerController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public CustomerController(HudumaDbContext context)
        {
            _context = context;
        }

        // --- 1. Service Request Workflow (Corrected for Marketplace Model) ---

        [HttpPost("service-requests")]
        public async Task<IActionResult> CreateServiceRequest([FromBody] ServiceRequestDto requestDto) 
        {
            var customerId = GetAuthenticatedCustomerId();

            // Check if provider exists and is linked to the service
            var provider = await _context.ServiceProviders
                .FirstOrDefaultAsync(p => p.ServiceProviderId == requestDto.ServiceProviderId && p.ServiceId == requestDto.ServiceId);
            
            if (provider == null)
            {
                return NotFound(new { message = "Service provider not found or not associated with this service." });
            }

            var serviceRequest = new ServiceRequest
            {
                CustomerId = customerId,
                ServiceId = requestDto.ServiceId,
                ServiceProviderId = requestDto.ServiceProviderId, // Assign directly to provider
                Description = requestDto.Description,
                Status = "PendingProvider", // NEW STATUS: Waiting for provider to accept
                RequestedDate = DateTime.UtcNow
            };

            _context.ServiceRequests.Add(serviceRequest);
            await _context.SaveChangesAsync();

            // TODO: In a real app, trigger a notification (SignalR, email) to the provider
            
            return Ok(new { message = "Service request sent to provider successfully", serviceRequest.ServiceRequestId });
        }

        [HttpGet("service-requests")]
        public async Task<ActionResult<IEnumerable<object>>> GetMyServiceRequests()
        {
            var customerId = GetAuthenticatedCustomerId();

            var requests = await _context.ServiceRequests
                .Where(sr => sr.CustomerId == customerId)
                .OrderByDescending(sr => sr.RequestedDate)
                .Select(sr => new { 
                    sr.ServiceRequestId,
                    sr.Description,
                    sr.Status,
                    sr.RequestedDate,
                    Service = sr.Service.ServiceName,
                    ServiceProvider = sr.ServiceProvider.FullName
                })
                .ToListAsync();
            
            return Ok(requests);
        }

        // --- 2. Order Workflow (Corrected) ---

        [HttpPost("orders")]
        public async Task<ActionResult<OrderResponseDto>> CreateOrderFromRequest([FromBody] OrderCreateDto orderDto) 
        {
            var customerId = GetAuthenticatedCustomerId();

            var request = await _context.ServiceRequests.FindAsync(orderDto.ServiceRequestId);

            if (request == null) return NotFound(new { message = "Service Request not found" });
            if (request.CustomerId != customerId) return Forbid(); // Not this customer's request
            
            // LOGIC CHECK: Can only create order if Provider "Accepted"
            if (request.Status != "ProviderAccepted")
            {
                return BadRequest(new { message = "Request has not been accepted by the provider yet."});
            }

            // Check if order already exists for this request
            var existingOrder = await _context.Orders.FirstOrDefaultAsync(o => o.ServiceRequestId == request.ServiceRequestId);
            if (existingOrder != null)
            {
                return BadRequest(new { message = "An order has already been created for this request." });
            }
            
            // In a real system, the amount would come from the provider's quote
            // For now, we'll use a placeholder
            var amount = 1000m; // Example amount

            var order = new Order
            {
                CustomerId = customerId,
                ServiceProviderId = request.ServiceProviderId,
                ServiceRequestId = request.ServiceRequestId,
                Amount = amount,
                Status = "PendingPayment", 
                CreatedOn = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            request.Status = "OrderCreated"; // Update request status
            await _context.SaveChangesAsync();
            
            return Ok(new OrderResponseDto { 
                OrderId = order.OrderId,
                Status = order.Status,
                Amount = order.Amount,
                CreatedOn = order.CreatedOn
            });
        }

        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetMyOrders()
        {
            var customerId = GetAuthenticatedCustomerId();

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
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

        // --- 3. Payment Workflow ---

        [HttpPost("payments")]
        public async Task<ActionResult<PaymentResponseDto>> PayForOrder([FromBody] PaymentDto paymentDto)
        {
            var customerId = GetAuthenticatedCustomerId();
            
            var order = await _context.Orders.FindAsync(paymentDto.OrderId);
            
            if (order == null) return NotFound(new { message = "Order not found" });
            if (order.CustomerId != customerId) return Forbid();
            if (order.Status != "PendingPayment") return BadRequest(new { message = "Order is not pending payment." });

            // Simulate a successful payment
            var paymentSuccessful = true; 
            if (!paymentSuccessful)
            {
                return BadRequest(new { message = "Payment failed" });
            }
            
            var payment = new Payment
            {
                OrderId = order.OrderId,
                Amount = order.Amount,
                Status = "Successful", 
                PaymentDate = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            order.Status = "PaymentConfirmed"; // IMPORTANT: Update order status
            await _context.SaveChangesAsync();

            // TODO: Notify provider that payment is complete

            return Ok(new PaymentResponseDto
            {
                PaymentId = payment.PaymentId,
                OrderId = payment.OrderId,
                Amount = payment.Amount,
                Status = payment.Status,
                PaymentDate = payment.PaymentDate
            });
        }
        
        // --- 4. Rating Workflow ---

        [HttpPost("ratings")]
        public async Task<IActionResult> RateOrder([FromBody] RatingDto ratingDto)
        {
            var customerId = GetAuthenticatedCustomerId();

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderId == ratingDto.OrderId);
            if (order == null) return NotFound(new { message = "Order not found" });
            if (order.CustomerId != customerId) return Forbid(); // Not this customer's order
            if (order.Status != "Completed") return BadRequest(new { message = "Can only rate completed orders." });
            
            var alreadyRated = await _context.Ratings.AnyAsync(r => r.OrderId == ratingDto.OrderId);
            if (alreadyRated) return BadRequest(new { message = "This order has already been rated." });

            var rating = new Rating
            {
                CustomerId = customerId,
                ServiceProviderId = order.ServiceProviderId,
                OrderId = order.OrderId,
                Rate = ratingDto.Rate,
                Review = ratingDto.Review,
                RatedOn = DateTime.UtcNow
            };

            _context.Ratings.Add(rating);
            await _context.SaveChangesAsync();

            // Update the provider's average rating
            await UpdateProviderAverageRating(order.ServiceProviderId);

            return Ok(new { message = "Thank you for your feedback!" });
        }

        // --- Helper Methods ---
        private int GetAuthenticatedCustomerId()
        {
            var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            if (userIdClaim == null) throw new UnauthorizedAccessException("User ID not found in token.");
            return int.Parse(userIdClaim.Value);
        }

        private async Task UpdateProviderAverageRating(int? serviceProviderId)
        {
            if (serviceProviderId == null) return;

            var provider = await _context.ServiceProviders.FindAsync(serviceProviderId);
            if (provider == null) return;

            var average = await _context.Ratings
                .Where(r => r.ServiceProviderId == serviceProviderId)
                .AverageAsync(r => (double?)r.Rate) ?? 0;
            
            provider.AverageRating = average;
            await _context.SaveChangesAsync();
        }
    }
}
