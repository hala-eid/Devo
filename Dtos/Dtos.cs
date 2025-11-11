using System.ComponentModel.DataAnnotations;

namespace Devo.Dtos
{
    public class LoginDto
    {
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";
    }

    public class RegisterDto
    {
        public string FullName { get; set; } = "";
        public string Email { get; set; } = "";
        public string PasswordHash { get; set; } = "";
        public string ConfirmPassword { get; set; } = "";

        [Required(ErrorMessage = "Job title is required")]
        public string JobTitle { get; set; } = null!;

        [Phone(ErrorMessage = "Invalid phone number")]
        public string PhoneNumber { get; set; }

        public string? Location { get; set; }

        public string Role { get; set; }

        public string? Department { get; set; }

        public string? ProfilePhoto { get; set; } // optional, base64 or URL

        // New fields
        public string ReportsTo { get; set; } // optional manager/supervisor
        public string? Organization { get; set; } // optional organization/company name
    }
}
