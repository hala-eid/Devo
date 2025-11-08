using Microsoft.EntityFrameworkCore;
using DevoBackend.Data;
using Microsoft.AspNetCore.Authentication.Cookies;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database connection
builder.Services.AddDbContext<DevoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 👇 Add cookie + Google + Facebook authentication
builder.Services.AddAuthentication(options =>
{
  options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie()

// CORS for Angular 4200
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngular", policy =>
      policy.WithOrigins("http://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod());
});


var app = builder.Build();

// ✅ Check database connection (this part is great)
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<DevoDbContext>();
  try
  {
    db.Database.CanConnect();
    Console.WriteLine("✅ Connected to database successfully!");
  }
  catch (Exception ex)
  {
    Console.WriteLine("❌ Database connection failed: " + ex.Message);
  }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // You can enable later when you use HTTPS

app.UseRouting();
app.UseCors("AllowAngular");

app.UseAuthentication();  // 👈 Must come before UseAuthorization
app.UseAuthorization();   // 👈 Only once (you had it twice)

app.MapControllers();

app.Run();

