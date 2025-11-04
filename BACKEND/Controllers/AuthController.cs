using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Authorization;
using BACKEND.Data;
using BACKEND.DTOs;
using BACKEND.Models;
using BACKEND.Services;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Linq;
using BCrypt.Net;
using ServiceProviderModel = BACKEND.Models.ServiceProvider;

namespace BACKEND.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly HudumaDbContext _context;
        private readonly JwtService _jwtService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(HudumaDbContext context, JwtService jwtService, ILogger<AuthController> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _logger = logger;
        }

        // ------------------------------------------------
        // SIGNUP ENDPOINT
        // ------------------------------------------------
        [HttpPost("signup")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> SignUp([FromBody] SignUpDto signUpDto)
        {
            _logger.LogInformation("SignUp attempt for {Email}", signUpDto.Email);
            var email = signUpDto.Email.ToLower();
            var role = signUpDto.Role.ToLower();

            // 1. Check if email already exists
            if (await _context.Admins.AnyAsync(a => a.Email == email) ||
                await _context.Customers.AnyAsync(c => c.Email == email) ||
                await _context.ServiceProviders.AnyAsync(sp => sp.Email == email))
            {
                _logger.LogWarning("SignUp failed: Email {Email} already exists.", email);
                return BadRequest(new { message = "Email already exists" });
            }

            // 2. Hash the password
            string passwordHash = BCrypt.Net.BCrypt.HashPassword(signUpDto.Password);
            string token = "";
            int userId = 0;

            // 3. Create the user based on role
            switch (role)
            {
                case "admin":
                    var admin = new Admin
                    {
                        FullName = signUpDto.FullName,
                        Email = email,
                        Phone = signUpDto.Phone,
                        PasswordHash = passwordHash
                    };
                    _context.Admins.Add(admin);
                    await _context.SaveChangesAsync();
                    userId = admin.AdminId;
                    token = _jwtService.GenerateToken(userId, email, "Admin");
                    break;

                case "customer":
                    var customer = new Customer
                    {
                        CustomerName = signUpDto.FullName,
                        Email = email,
                        Phone = signUpDto.Phone,
                        PasswordHash = passwordHash
                    };
                    _context.Customers.Add(customer);
                    await _context.SaveChangesAsync();
                    userId = customer.CustomerId;
                    token = _jwtService.GenerateToken(userId, email, "Customer");
                    break;

                case "serviceprovider":
                    var serviceProvider = new ServiceProviderModel
                    {
                        FullName = signUpDto.FullName,
                        Email = email,
                        Phone = signUpDto.Phone,
                        PasswordHash = passwordHash,
                        ServiceId = signUpDto.ServiceId // This can be null, it's fine
                    };
                    _context.ServiceProviders.Add(serviceProvider);
                    await _context.SaveChangesAsync();
                    userId = serviceProvider.ServiceProviderId;
                    token = _jwtService.GenerateToken(userId, email, "ServiceProvider");
                    break;

                default:
                    _logger.LogWarning("SignUp failed: Invalid role '{Role}' specified.", signUpDto.Role);
                    return BadRequest(new { message = "Invalid role specified" });
            }

            _logger.LogInformation("New user {Role} created: {Email}", role, email);
            return Ok(new AuthResponseDto
            {
                Token = token,
                Role = role,
                UserId = userId,
                FullName = signUpDto.FullName,
                Email = email
            });
        }


        // ------------------------------------------------
        // LOGIN ENDPOINT
        // ------------------------------------------------
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] SignInDto loginDto)
        {
            _logger.LogInformation("Login attempt for {Email}", loginDto.Email);

            var email = loginDto.Email.ToLower();
            object? user = null;
            string role = "";

            // Try Admin
            user = await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
            if (user != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, ((Admin)user).PasswordHash))
                role = "Admin";
            else
            {
                // Try Customer
                user = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
                if (user != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, ((Customer)user).PasswordHash))
                    role = "Customer";
                else
                {
                    // Try Service Provider
                    user = await _context.ServiceProviders.FirstOrDefaultAsync(sp => sp.Email == email);
                    if (user != null && BCrypt.Net.BCrypt.Verify(loginDto.Password, ((ServiceProviderModel)user).PasswordHash))
                        role = "ServiceProvider";
                }
            }

            if (user == null || string.IsNullOrEmpty(role))
            {
                _logger.LogWarning("Invalid login for {Email}", email);
                return Unauthorized(new { message = "Invalid email or password" });
            }

            int userId = 0;
            string fullName = "";
            string token = "";

            switch (role)
            {
                case "Admin":
                    var admin = (Admin)user;
                    userId = admin.AdminId;
                    fullName = admin.FullName;
                    token = _jwtService.GenerateToken(userId, admin.Email, role);
                    break;

                case "Customer":
                    var customer = (Customer)user;
                    userId = customer.CustomerId;
                    fullName = customer.CustomerName;
                    token = _jwtService.GenerateToken(userId, customer.Email, role);
                    break;

                case "ServiceProvider":
                    var provider = (ServiceProviderModel)user;
                    userId = provider.ServiceProviderId;
                    fullName = provider.FullName;
                    token = _jwtService.GenerateToken(userId, provider.Email, role);
                    break;
            }

            _logger.LogInformation("{Role} logged in: {Email}", role, email);

            // Return the rich DTO
            return Ok(new AuthResponseDto
            {
                Token = token,
                Role = role,
                UserId = userId,
                FullName = fullName, // Added
                Email = email        // Added
            });
        }

        // ------------------------------------------------
        // CURRENT USER ENDPOINT
        // ------------------------------------------------
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<object>> GetCurrentUser()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (email == null || role == null)
                return Unauthorized(new { message = "Invalid token" });

            _logger.LogInformation("Fetching profile for {Email} ({Role})", email, role);

            switch (role)
            {
                case "Admin":
                    var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
                    if (admin == null) return NotFound();
                    return Ok(new
                    {
                        Role = "Admin",
                        admin.AdminId,
                        admin.FullName,
                        admin.Email,
                        admin.Phone
                    });

                case "Customer":
                    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
                    if (customer == null) return NotFound();
                    return Ok(new
                    {
                        Role = "Customer",
                        customer.CustomerId,
                        CustomerName = customer.CustomerName, // Keep DTO property names consistent
                        customer.Email,
                        customer.Phone
                    });

                case "ServiceProvider":
                    var provider = await _context.ServiceProviders.FirstOrDefaultAsync(sp => sp.Email == email);
                    if (provider == null) return NotFound();
                    return Ok(new
                    {
                        Role = "ServiceProvider",
                        provider.ServiceProviderId,
                        provider.FullName,
                        provider.Email,
                        provider.Phone
                    });

                default:
                    return Unauthorized(new { message = "Invalid role" });
            }
        }

        // ------------------------------------------------
        // UPDATE CURRENT USER ENDPOINT
        // ------------------------------------------------
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateCurrentUser([FromBody] UserUpdateDto updateDto)
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);

            if (email == null || role == null)
                return Unauthorized(new { message = "Invalid token" });

            _logger.LogInformation("Updating profile for {Email} ({Role})", email, role);

            // --- Check for email uniqueness if it's being changed ---
            if (!string.IsNullOrEmpty(updateDto.Email) && updateDto.Email.ToLower() != email.ToLower())
            {
                var newEmail = updateDto.Email.ToLower();
                if (await _context.Admins.AnyAsync(a => a.Email == newEmail) ||
                    await _context.Customers.AnyAsync(c => c.Email == newEmail) ||
                    await _context.ServiceProviders.AnyAsync(sp => sp.Email == newEmail))
                {
                    _logger.LogWarning("Update profile failed: New email {NewEmail} already exists.", newEmail);
                    return BadRequest(new { message = "This email is already in use by another account." });
                }
            }
            
            switch (role)
            {
                case "Admin":
                    var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == email);
                    if (admin == null) return NotFound();
                    
                    admin.FullName = updateDto.FullName ?? admin.FullName;
                    admin.Email = updateDto.Email ?? admin.Email;
                    admin.Phone = updateDto.Phone ?? admin.Phone;
                    break;

                case "Customer":
                    var customer = await _context.Customers.FirstOrDefaultAsync(c => c.Email == email);
                    if (customer == null) return NotFound();
                    
                    customer.CustomerName = updateDto.FullName ?? customer.CustomerName;
                    customer.Email = updateDto.Email ?? customer.Email;
                    customer.Phone = updateDto.Phone ?? customer.Phone;
                    break;

                case "ServiceProvider":
                    var provider = await _context.ServiceProviders.FirstOrDefaultAsync(sp => sp.Email == email);
                    if (provider == null) return NotFound();

                    provider.FullName = updateDto.FullName ?? provider.FullName;
                    provider.Email = updateDto.Email ?? provider.Email;
                    provider.Phone = updateDto.Phone ?? provider.Phone;
                    break;

                default:
                    return Unauthorized(new { message = "Invalid role" });
            }

            await _context.SaveChangesAsync();
            _logger.LogInformation("Profile updated successfully for {Email}", email);
            return NoContent(); // 204 No Content is standard for a successful PUT
        }
    }
}
