using Microsoft.AspNetCore.Mvc;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace BACKEND.Controllers
{
    [Route("api/payments")]
    [ApiController]
    public class PaymentsController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public PaymentsController(HudumaDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<Payment>> CreatePayment(PaymentDto paymentDto)
        {
            var order = await _context.Orders.FindAsync(paymentDto.OrderId);

            if (order == null)
            {
                return BadRequest("Invalid order.");
            }
            
            if (order.Status == "completed")
            {
                return BadRequest("Order is already completed.");
            }

            var payment = new Payment
            {
                OrderId = paymentDto.OrderId,
                Status = "Paid",
                Amount = order.Amount, // <-- FIX: Added this to store the amount
                PaymentDate = DateTime.UtcNow
                // UpdatedOn = DateTime.UtcNow <-- FIX: Removed this line, it's not in the model
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { paymentId = payment.PaymentId }, payment);
        }

        [HttpGet("{paymentId}")]
        public async Task<ActionResult<Payment>> GetPayment(int paymentId)
        {
            var payment = await _context.Payments.FindAsync(paymentId);

            if (payment == null)
            {
                return NotFound();
            }

            return payment;
        }

        // Get all payments made by a specific customer
        [HttpGet("customer/{customerId}")]
        public async Task<ActionResult<IEnumerable<PaymentResponseDto>>> GetPaymentsByCustomer(int customerId)
        {
            var payments = await _context.Payments
                .Include(p => p.Order)
                .Where(p => p.Order != null && p.Order.CustomerId == customerId)
                .ToListAsync();

            if (!payments.Any())
            {
                return NotFound("No payments found for this customer.");
            }

            return payments.Select(p => new PaymentResponseDto
            {
                PaymentId = p.PaymentId,
                OrderId = p.OrderId, // <-- FIX: Removed the unnecessary '?? 0'
                Amount = p.Amount,   // <-- FIX: Get Amount from the Payment, not the Order
                Status = p.Status,
                PaymentDate = p.PaymentDate
            }).ToList();
        }

        // Get all payments received by a specific service provider
        [HttpGet("service-provider/{serviceProviderId}")]
        public async Task<ActionResult<IEnumerable<PaymentResponseDto>>> GetPaymentsByServiceProvider(int serviceProviderId)
        { // <-- FIX: Removed the stray 'L' from this line
            var payments = await _context.Payments
                .Include(p => p.Order)
                .Where(p => p.Order != null && p.Order.ServiceProviderId == serviceProviderId)
                .ToListAsync();

            if (!payments.Any())
            {
                return NotFound("No payments found for this service provider.");
            }

            return payments.Select(p => new PaymentResponseDto
            {
                PaymentId = p.PaymentId,
                OrderId = p.OrderId, // <-- FIX: Removed the unnecessary '?? 0'
                Amount = p.Amount,   // <-- FIX: Get Amount from the Payment, not the Order
                Status = p.Status,
                PaymentDate = p.PaymentDate
            }).ToList();
        }
    }
}

