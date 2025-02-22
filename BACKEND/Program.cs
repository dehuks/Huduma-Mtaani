using Microsoft.EntityFrameworkCore;
using BACKEND.Data;
using BACKEND.Services;
using BACKEND.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add ALL services before builder.Build()
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

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

// Build the application AFTER all service registration
var app = builder.Build();

// Configure middleware and HTTP pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();


app.Run();