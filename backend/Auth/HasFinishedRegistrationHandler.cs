using backend.Utils;
using Microsoft.AspNetCore.Authorization;

namespace backend.Auth;

public class HasFinishedRegistrationHandler(ILogger<HasFinishedRegistrationHandler> logger, IdentityUtils identityUtils) : AuthorizationHandler<HasFinishedRegistrationRequirement>
{
  private readonly IdentityUtils identityUtils = identityUtils;
  private readonly ILogger<HasFinishedRegistrationHandler> logger = logger;

  protected async override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasFinishedRegistrationRequirement requirement)
  {
    if (context.User is null)
    {
      return;
    }

    var user = await identityUtils.GetUserAsync(context.User);

    var hasUserFinishedRegistration = !string.IsNullOrEmpty(user.FirstName) && !string.IsNullOrEmpty(user.LastName);
    logger.LogInformation("{hasUserFinishedRegistration} {hasUserFinishedRegistration}", nameof(hasUserFinishedRegistration), hasUserFinishedRegistration);
    if (hasUserFinishedRegistration)
    {
      context.Succeed(requirement);
    }
  }
}
