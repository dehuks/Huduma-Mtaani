using Microsoft.EntityFrameworkCore;
using BACKEND.Data;
using BACKEND.Services;
using BACKEND.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

//JWT
builder.Services.AddJwtAuthentication(builder.Configuration);
builder.Services.AddScoped<JwtService>();

// Add Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure PostgreSQL and DbContext
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<HudumaDbContext>(options =>
    options.UseNpgsql(connectionString, b => b.MigrationsAssembly("BACKEND")));

var app = builder.Build();

// Enable middleware to serve Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger(); // Generates Swagger JSON
    app.UseSwaggerUI(); // Generates Swagger UI
}

// Configure the HTTP request pipeline.
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
