using Microsoft.AspNetCore.Mvc;
using DevoBackend.Data;
using DevoBackend.Models;
using System.Security.Cryptography;
using System.Text;
using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore; // for FirstOrDefaultAsync

namespace DevoBackend.Controllers
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
    [Produces("application/json")]
    public async Task<IActionResult> Register([FromBody] User request)
    {
      // 1️⃣ Validate required fields
      if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.PasswordHash))
      {
        return BadRequest(new { message = "Email and password are required." });
      }

      // 2️⃣ Check if email already exists
      var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
      if (existingUser != null)
      {
        return BadRequest(new { message = "Email already registered." });
      }

      // 3️⃣ Set default role if not provided
      if (string.IsNullOrEmpty(request.Role))
      {
        request.Role = "Employee";
      }

      // 4️⃣ Hash the password
      var hashedPassword = HashPassword(request.PasswordHash);

      // 5️⃣ Create User object
      var user = new User
      {
        FullName = request.FullName,
        Email = request.Email,
        PasswordHash = HashPassword(request.PasswordHash),
        JobTitle = request.JobTitle,
        PhoneNumber = request.PhoneNumber,
        Location = request.Location,
        Role = request.Role,
        Department = request.Department,
        ProfilePhoto = request.ProfilePhoto,
        ReportsTo = request.ReportsTo,        // new field
        Organization = request.Organization   // new field
      };


      // 6️⃣ Save to database
      _context.Users.Add(user);
      await _context.SaveChangesAsync();

      return new JsonResult(new { message = $"{user.Role} registered successfully!" });
    }

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

