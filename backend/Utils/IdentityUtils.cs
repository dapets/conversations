using System.Security.Claims;
using backend.Entities;
using CommunityToolkit.Diagnostics;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Utils;

public class IdentityUtils(UserManager<ApplicationUser> userManager, ApplicationDbContext dbContext)
{
    private readonly UserManager<ApplicationUser> userManager = userManager;

    private readonly ApplicationDbContext dbContext = dbContext;

    public async Task<ApplicationUser> GetUserAsync(ClaimsPrincipal? claimsPrincipal)
    {
        Guard.IsNotNull(claimsPrincipal);
        var user = await userManager.GetUserAsync(claimsPrincipal) ?? throw new ArgumentException($"Couldn't find user corresponding to {nameof(claimsPrincipal)}");
        Guard.IsNotNull(user);
        return user;
    }

    public async Task<bool> IsMemberOfChat(int chatsId, ApplicationUser user)
    {
        return await dbContext
            .Chats
            .Where(c => c.Members.Any(m => m.Id == user.Id))
            .AnyAsync(c => c.Id == chatsId);
    }
}
