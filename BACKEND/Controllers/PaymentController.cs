using Microsoft.AspNetCore.Mvc;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

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

            if (order == null || order.Status == "completed")
            {
                return BadRequest("Invalid order or already completed.");
            }

            var payment = new Payment
            {
                OrderId = paymentDto.OrderId,
                Status = "Paid",
                PaymentDate = DateTime.UtcNow
            };

            order.Status = "completed"; // Mark order as completed
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
    }
}
