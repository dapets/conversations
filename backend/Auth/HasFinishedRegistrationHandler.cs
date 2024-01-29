using backend.Utils;
using Microsoft.AspNetCore.Authorization;

namespace backend.Auth;

public class HasFinishedRegistrationHandler(IdentityUtils identityUtils) : AuthorizationHandler<HasFinishedRegistrationRequirement>
{
  private readonly IdentityUtils identityUtils = identityUtils;

  protected async override Task HandleRequirementAsync(AuthorizationHandlerContext context, HasFinishedRegistrationRequirement requirement)
  {
    if (context.User is not null)
    {
      return;
    }

    var user = await identityUtils.GetUserAsync(context.User);

    var hasUserFinishedRegistration = !string.IsNullOrEmpty(user.FirstName) && !string.IsNullOrEmpty(user.LastName);
    Console.WriteLine($"{nameof(hasUserFinishedRegistration)} {hasUserFinishedRegistration}");
    if (hasUserFinishedRegistration)
    {
      context.Succeed(requirement);
    }
  }
}
