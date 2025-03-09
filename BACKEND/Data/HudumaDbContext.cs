using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using BACKEND.Models;

namespace BACKEND.Data
{
    public class HudumaDbContext : DbContext
    {
        public HudumaDbContext(DbContextOptions<HudumaDbContext> options) : base(options)
        {
        }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Service> Services { get; set; }
        public DbSet<Models.ServiceProvider> ServiceProviders { get; set; }
        public DbSet<Rating> Ratings { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Admin> Admins { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Hash the default password
            string passwordHash = HashPassword("Admin@123");

            modelBuilder.Entity<Admin>().HasData(new Admin
            {
                AdminId = 1,
                FullName = "Super Admin",
                Email = "admin@yourdomain.com",
                Phone = "1234567890",
                PasswordHash = passwordHash
            });
        }

        private static string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return Convert.ToBase64String(hashedBytes);
            }
        }
    }
}
