namespace devo2.Models
{
    public class ChangePasswordDto
    {
        public int UserId { get; set; }
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    // Model
    public class UserPreferences
    {
        public string Username { get; set; }
        public string Theme { get; set; }
    }
}
