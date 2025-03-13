using Microsoft.AspNetCore.Mvc;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BACKEND.Controllers
{
    [Route("api/orders")]
    [ApiController]
   
    public class OrdersController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public OrdersController(HudumaDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        
        public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
        {
            var order = new Order
            {
                CustomerId = orderDto.CustomerId,
                ServiceProviderId = orderDto.ServiceProviderId,
                Amount = orderDto.Amount,
                Status = "pending"
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { orderId = order.OrderId }, order);
        }

        [HttpGet("{orderId}")]
        public async Task<ActionResult<Order>> GetOrder(int orderId)
        {
            var order = await _context.Orders.FindAsync(orderId);
            if (order == null)
            {
                return NotFound();
            }

            return order;
        }

        [HttpGet("customer/{customerId}")]
        
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetCustomerOrders(int customerId)
        {
            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
                .ToListAsync();

            return orders.Select(o => new OrderResponseDto
            {
                OrderId = o.OrderId,
                Status = o.Status,
                Amount = o.Amount,
                CreatedOn = o.CreatedOn
            }).ToList();
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetAllOrders()
        {   
             var orders = await _context.Orders.ToListAsync();

                return orders.Select(o => new OrderResponseDto
            {
                OrderId = o.OrderId,
                Status = o.Status,
                Amount = o.Amount,
                CreatedOn = o.CreatedOn
             }).ToList();
        }


        
    }
}
