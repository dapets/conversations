﻿using System.Security.Claims;
using backend.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend;

public class IdentityUtils(UserManager<ApplicationUser> userManager)
{
    private readonly UserManager<ApplicationUser> userManager = userManager;

    public async Task<ApplicationUser> GetUser(ClaimsPrincipal claimsPrincipal)
    {
        var user = await userManager.GetUserAsync(claimsPrincipal) ?? throw new ArgumentException($"Couldn't find user corresponding to {nameof(claimsPrincipal)}");
        return user;
    }
}