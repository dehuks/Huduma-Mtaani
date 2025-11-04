using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using BACKEND.DTOs;
using BACKEND.Data;
using BACKEND.Models;
using BACKEND.Services;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using BCrypt.Net;
using Microsoft.Extensions.Logging;

namespace BACKEND.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly HudumaDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(HudumaDbContext context, ILogger<AdminController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // ----------------------------
        // ADMIN USER MANAGEMENT
        // ----------------------------

        [HttpPost("create-admin")]
        public async Task<ActionResult<AdminResponseDto>> CreateAdmin(AdminDto adminDto)
        {
            var emailExists =
                await _context.Customers.AnyAsync(c => c.Email == adminDto.Email) ||
                await _context.ServiceProviders.AnyAsync(sp => sp.Email == adminDto.Email) ||
                await _context.Admins.AnyAsync(a => a.Email == adminDto.Email);

            if (emailExists)
                return BadRequest(new { message = "Email already exists" });

            var admin = new Admin
            {
                FullName = adminDto.FullName,
                Email = adminDto.Email,
                Phone = adminDto.Phone,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminDto.Password)
            };

            _context.Admins.Add(admin);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Admin created new admin: {Email}", adminDto.Email);

            return Ok(new AdminResponseDto
            {
                AdminId = admin.AdminId,
                FullName = admin.FullName,
                Email = admin.Email,
                Phone = admin.Phone
            });
        }

        [HttpGet("manage-admins")]
        public async Task<ActionResult<IEnumerable<AdminResponseDto>>> GetAllAdmins()
        {
            _logger.LogInformation("Admin fetching all admin accounts");

            return await _context.Admins
                .Select(a => new AdminResponseDto
                {
                    AdminId = a.AdminId,
                    FullName = a.FullName,
                    Email = a.Email,
                    Phone = a.Phone
                })
                .ToListAsync();
        }

        [HttpGet("manage-admins/{id}")]
        public async Task<ActionResult<AdminResponseDto>> GetAdmin(int id)
        {
            _logger.LogInformation("Admin fetching admin account {Id}", id);
            var admin = await _context.Admins.FindAsync(id);

            if (admin == null)
                return NotFound(new { message = "Admin not found" });

            return Ok(new AdminResponseDto
            {
                AdminId = admin.AdminId,
                FullName = admin.FullName,
                Email = admin.Email,
                Phone = admin.Phone
            });
        }

        [HttpPut("manage-admins/{id}")]
        public async Task<IActionResult> UpdateAdmin(int id, AdminDto adminDto)
        {
            _logger.LogInformation("Admin updating admin account {Id}", id);
            var admin = await _context.Admins.FindAsync(id);

            if (admin == null)
                return NotFound(new { message = "Admin not found" });

            var newEmail = adminDto.Email.ToLower();
            if (admin.Email != newEmail)
            {
                var emailExists =
                    await _context.Customers.AnyAsync(c => c.Email == newEmail) ||
                    await _context.ServiceProviders.AnyAsync(sp => sp.Email == newEmail) ||
                    await _context.Admins.AnyAsync(a => a.Email == newEmail && a.AdminId != id);

                if (emailExists)
                    return BadRequest(new { message = "Email already in use" });

                admin.Email = newEmail;
            }

            admin.FullName = adminDto.FullName;
            admin.Phone = adminDto.Phone;

            if (!string.IsNullOrEmpty(adminDto.Password))
            {
                _logger.LogWarning("Admin resetting password for {Id}", id);
                admin.PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminDto.Password);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Admin profile updated" });
        }

        [HttpDelete("manage-admins/{id}")]
        public async Task<IActionResult> DeleteAdmin(int id)
        {
            _logger.LogWarning("Admin deleting admin account {Id}", id);
            var admin = await _context.Admins.FindAsync(id);

            if (admin == null)
                return NotFound(new { message = "Admin not found" });

            if (await _context.Admins.CountAsync() == 1)
                return BadRequest(new { message = "Cannot delete the last admin account." });

            _context.Admins.Remove(admin);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Admin deleted" });
        }

        // ----------------------------
        // PLATFORM MANAGEMENT
        // ----------------------------

        [HttpGet("servicerequests")]
        public async Task<ActionResult<IEnumerable<object>>> GetAllServiceRequests()
        {
            _logger.LogInformation("Admin fetching all service requests");

            var requests = await _context.ServiceRequests
                .Select(sr => new
                {
                    sr.ServiceRequestId,
                    sr.Description,
                    sr.Status,
                    sr.RequestedDate,
                    CustomerName = sr.Customer.CustomerName,
                    ProviderName = sr.ServiceProvider.FullName
                })
                .ToListAsync();

            return Ok(requests);
        }

        [HttpPatch("servicerequests/{id}/status")]
        public async Task<IActionResult> UpdateRequestStatus(int id, [FromBody] UpdateRequestStatusDto statusDto)
        {
            _logger.LogWarning("Admin manually updating status for request {Id}", id);
            var request = await _context.ServiceRequests.FindAsync(id);

            if (request == null)
                return NotFound();

            if (statusDto.Status.ToLower() == "cancelled")
            {
                request.Status = "Cancelled";
                await _context.SaveChangesAsync();
                return Ok(new { message = "Request cancelled by admin" });
            }

            return BadRequest(new { message = "Admin can only set status to 'Cancelled'." });
        }

        [HttpGet("orders")]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetAllOrders()
        {
            var orders = await _context.Orders
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

        [HttpGet("customers/{customerId}/orders")]
        public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrdersForCustomer(int customerId)
        {
            _logger.LogInformation("Admin fetching orders for CustomerId {CustomerId}", customerId);

            var customerExists = await _context.Customers.AnyAsync(c => c.CustomerId == customerId);
            if (!customerExists)
                return NotFound(new { message = "Customer not found" });

            var orders = await _context.Orders
                .Where(o => o.CustomerId == customerId)
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
    }

    // Supporting DTO
    public class UpdateRequestStatusDto
    {
        public string Status { get; set; }
    }
}
