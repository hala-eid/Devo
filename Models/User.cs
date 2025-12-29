using System.ComponentModel.DataAnnotations;

namespace devo2.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string JobTitle { get; set; }
        public string Department { get; set; }
        public string ReportTo { get; set; }
        public string PhoneNumber { get; set; }
        public string ContactDetails { get; set; }
        public string Organization { get; set; }
        public string Location { get; set; }
        public string ProfilePhotoUrl { get; set; }
        public bool CookiesAccepted { get; internal set; }
        public bool TwoFactorEnabled { get; internal set; }
        public string Language { get; internal set; }
        public string TimeZone { get; internal set; }
        public string UserName { get; internal set; }
    }
}
