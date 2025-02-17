using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace BACKEND.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<HudumaDbContext>
    {
        public HudumaDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

            var connectionString = configuration.GetConnectionString("DefaultConnection");

            var optionsBuilder = new DbContextOptionsBuilder<HudumaDbContext>();
            optionsBuilder.UseNpgsql(connectionString);

            return new HudumaDbContext(optionsBuilder.Options);
        }
    }
}
