namespace devo2.Models
{
    public class UserProfileDto
    {
        public string FullName { get; set; } = string.Empty;
        public string JobTitle { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string ReportTo { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Organization { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string ProfilePhotoUrl { get; set; } = "/pfp.jpg";
    }
}
