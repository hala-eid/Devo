namespace devo2.Models
{
    public class RegisterRequest
    {
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string? JobTitle { get; set; }
        public string? Department { get; set; }
        public string? ReportTo { get; set; }
        public string? PhoneNumber { get; set; }
        public string? ContactDetails { get; set; }
        public string? Organization { get; set; }
        public string? Location { get; set; }
        public string? ProfilePhotoUrl { get; set; }
    }
}
