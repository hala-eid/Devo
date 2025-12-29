using devo2.Hubs;
using DevoBackend.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// CORS policy name
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container
builder.Services.AddControllers();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy(MyAllowSpecificOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:4200") // Angular dev server
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // required for SignalR
    });
});

// Configure DbContext
builder.Services.AddDbContext<DevoDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// SignalR
builder.Services.AddSignalR();

// JWT Authentication
var jwtSecret = builder.Configuration["JwtSettings:Secret"] ?? "D9f7X2v8QpR4mK1sZb6Wj3nL0aC5eH8y";
var key = Encoding.ASCII.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key)
    };

    // Allow SignalR to receive access token from query string
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];

            var path = context.HttpContext.Request.Path;
            if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/teams"))
            {
                context.Token = accessToken;
            }
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
        options.JsonSerializerOptions.MaxDepth = 64;
    });


builder.Services.AddSingleton<IUserIdProvider, CustomUserIdProvider>();


var app = builder.Build();

// Use CORS
app.UseCors(MyAllowSpecificOrigins);

// Swagger only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage(); // This makes 500 errors descriptive
}

app.UseHttpsRedirection();
app.UseRouting();

// Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// Map controllers and SignalR hub
app.MapControllers();
app.MapHub<TeamsHub>("/hubs/teams");

app.Run();
public class CustomUserIdProvider : IUserIdProvider
{
    public string GetUserId(HubConnectionContext connection)
    {
        // This maps the 'NameIdentifier' claim from your JWT to SignalR's User concept
        return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }


}