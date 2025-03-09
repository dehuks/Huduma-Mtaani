using System.Security.Cryptography;
using System.Text;
using BACKEND.Data;
using BACKEND.Models;
using Microsoft.EntityFrameworkCore;

namespace BACKEND.Data
{
    public static class DbInitializer
    {
        public static void Initialize(IServiceProvider serviceProvider)
        {
            using (var context = new HudumaDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<HudumaDbContext>>()))
            {
                // Look for any admin
                if (context.Admins.Any())
                {
                    return;   // DB has been seeded
                }

                var admin = new Admin
                {
                    FullName = "Super Admin",
                    Email = "admin@yourdomain.com",
                    Phone = "1234567890",
                    PasswordHash = HashPassword("Admin@123")
                };

                context.Admins.Add(admin);
                context.SaveChanges();
            }
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