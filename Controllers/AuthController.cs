using Devo.Data;
using Devo.Dtos;
using Devo.models;
using Devo.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using System;

namespace Devo.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;

        public AuthController(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        // ---------- REGISTER ----------
        [HttpPost("register")]
        [Produces("application/json")]
        public async Task<IActionResult> Register([FromBody] User request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.PasswordHash))
                return BadRequest(new { message = "Email and password are required." });

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (existingUser != null)
                return BadRequest(new { message = "Email already registered." });

            if (string.IsNullOrEmpty(request.Role))
                request.Role = "Employee";

            var hashedPassword = HashPassword(request.PasswordHash);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = hashedPassword,
                JobTitle = request.JobTitle,
                PhoneNumber = request.PhoneNumber,
                Location = request.Location,
                Role = request.Role,
                Department = request.Department,
                ProfilePhoto = request.ProfilePhoto,
                ReportsTo = request.ReportsTo,
                Organization = request.Organization
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new JsonResult(new { message = $"{user.Role} registered successfully!" });
        }

        // ---------- LOGIN ----------
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.PasswordHash))
                return BadRequest(new { message = "Email and password are required." });

            var hashedPassword = HashPassword(request.PasswordHash);

            var user = await _context.Users.FirstOrDefaultAsync(u =>
                u.Email == request.Email && u.PasswordHash == hashedPassword);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            var tokenString = _jwtService.GenerateToken(user);

            return Ok(new
            {
                success = true,
                message = "Login successful",
                token = tokenString,
                user = new
                {
                    user.UserId,
                    user.FullName,
                    user.Email,
                    user.Role
                }
            });
        }

        // ---------- HELPER ----------
        private string HashPassword(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var bytes = Encoding.UTF8.GetBytes(password);
                var hash = sha256.ComputeHash(bytes);
                return Convert.ToBase64String(hash);
            }
        }
    }
}
