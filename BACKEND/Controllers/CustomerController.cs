using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace BACKEND.Controllers
{
    [Route("api/customers")]
    [ApiController]
    [Authorize(Roles = "Customer")]
    public class CustomersController : ControllerBase
    {
        private readonly HudumaDbContext _context;

        public CustomersController(HudumaDbContext context)
        {
            _context = context;
        }

        [HttpGet("{customerId}")]
        public async Task<ActionResult<CustomerResponseDto>> GetCustomer(int customerId)
        {
            var customer = await _context.Customers.FindAsync(customerId);
            if (customer == null)
            {
                return NotFound();
            }

            return new CustomerResponseDto
            {
                CustomerId = customer.CustomerId,
                CustomerName = customer.CustomerName,
                Email = customer.Email,
                Phone = customer.Phone,
                Address = customer.Address?.County
            };
        }

        [HttpPut("{customerId}")]
        public async Task<IActionResult> UpdateCustomer(int customerId, CustomerDto customerDto)
        {
            var customer = await _context.Customers.FindAsync(customerId);

            if (customer == null)
            {
                return NotFound();
            }

            customer.CustomerName = customerDto.CustomerName;
            customer.Email = customerDto.Email;
            customer.Phone = customerDto.Phone;
            customer.AddressId = customerDto.AddressId;

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
