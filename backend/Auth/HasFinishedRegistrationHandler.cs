using backend.Entities;
using backend.Utils;
using Microsoft.AspNetCore.Authorization;

namespace backend.Auth;

public class HasFinishedRegistrationHandler(ILogger<HasFinishedRegistrationHandler> logger, IdentityUtils identityUtils) : AuthorizationHandler<HasFinishedRegistrationRequirement>
{
  private readonly IdentityUtils identityUtils = identityUtils;
  private readonly ILogger<HasFinishedRegistrationHandler> logger = logger;

  protected async override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasFinishedRegistrationRequirement requirement)
  {
    if (context.User is null || context.User.Identity?.IsAuthenticated == false)
    {
      return;
    }

    ApplicationUser user;
    try
    {
      user = await identityUtils.GetUserAsync(context.User);
    }
    //This might happen when the user the token was issued to was deleted.
    catch (ArgumentException)
    {
      return;
    }

    var hasUserFinishedRegistration = !string.IsNullOrEmpty(user.FirstName) && !string.IsNullOrEmpty(user.LastName);
    logger.LogInformation("{hasUserFinishedRegistration} {hasUserFinishedRegistrationValue}", nameof(hasUserFinishedRegistration), hasUserFinishedRegistration);
    if (hasUserFinishedRegistration)
    {
      context.Succeed(requirement);
    }
  }
}
