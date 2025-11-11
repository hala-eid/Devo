namespace Devo.models
{
    public class SocialUser
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Provider { get; set; }
        public required string ProviderUserId { get; set; }

    }
}
