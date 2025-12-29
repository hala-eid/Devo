using Microsoft.AspNetCore.Mvc;
using DevoBackend.Data;
using devo2.Models;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using BCrypt.Net;
namespace devo2.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly DevoDbContext _context;

        public AuthController(DevoDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
                return Conflict(new { success = false, message = "Email already exists" });

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);

            var user = new User
            {
                FullName = request.FullName,
                Email = request.Email,
                PasswordHash = hashedPassword,
                JobTitle = request.JobTitle,
                Department = request.Department,
                ReportTo = request.ReportTo,
                PhoneNumber = request.PhoneNumber,
                ContactDetails = request.ContactDetails,
                Organization = request.Organization,
                Location = request.Location,
                ProfilePhotoUrl = request.ProfilePhotoUrl
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                success = true,
                message = "Registration successful",
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    jobTitle = user.JobTitle,
                    department = user.Department,
                    reportTo = user.ReportTo,
                    phoneNumber = user.PhoneNumber,
                    contactDetails = user.ContactDetails,
                    organization = user.Organization,
                    location = user.Location,
                    profilePhotoUrl = user.ProfilePhotoUrl
                }
            });
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1️⃣ Find the user by email
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null || !BCrypt.Net.BCrypt.Verify(request.PasswordHash, user.PasswordHash))
                return Unauthorized(new { success = false, message = "Invalid email or password" });

            // 2️⃣ Generate JWT token after verifying credentials
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("D9f7X2v8QpR4mK1sZb6Wj3nL0aC5eH8y");
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.Name, user.Email), // sets User.Identity.Name
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        }),
                Expires = DateTime.UtcNow.AddHours(1),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var jwtToken = tokenHandler.WriteToken(token);

            // 3️⃣ Return the user info along with the JWT token
            return Ok(new
            {
                success = true,
                message = "Login successful",
                token = jwtToken,
                user = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    jobTitle = user.JobTitle,
                    department = user.Department,
                    reportTo = user.ReportTo,
                    phoneNumber = user.PhoneNumber,
                    contactDetails = user.ContactDetails,
                    organization = user.Organization,
                    location = user.Location,
                    profilePhotoUrl = user.ProfilePhotoUrl
                }
            });
        }
    }
}
    