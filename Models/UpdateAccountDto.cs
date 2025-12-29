namespace devo2.Models
{
    public class UpdateAccountDto
    {
        public int UserId { get; set; }
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
    }
}
