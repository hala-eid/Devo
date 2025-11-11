using Devo.Controllers;
using Devo.Data;
using Devo.models;
using Microsoft.EntityFrameworkCore;

namespace Devo.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<User> AuthenticateAsync(string email, string password)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email && u.PasswordHash == password);
        }

        public async Task<User> FindOrCreateSocialUserAsync(SocialUser socialUser)
        {
            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == socialUser.Email);

            if (existingUser != null)
                return existingUser;

            var newUser = new User
            {
                Email = socialUser.Email,
                FullName = socialUser.Name,
                Role = "User",
                PasswordHash = Guid.NewGuid().ToString()
            };

            _context.Users.Add(newUser);
            await _context.SaveChangesAsync();

            return newUser;
        }
    }
}