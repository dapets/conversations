using System.ComponentModel;
using System.Net;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Utils;

public record SingleValidationProblem(string Key, string Value);

public static class HttpHelpers
{
  public static ProblemHttpResult ProduceBadRequestProblem(string details)
  {
    return TypedResults.Problem(details, statusCode: (int)HttpStatusCode.BadRequest);
  }

  public static ValidationProblem CreateValidationProblem(SingleValidationProblem problems) => CreateValidationProblems([problems]);

  public static ValidationProblem CreateValidationProblems(params SingleValidationProblem[] problems)
  {
    var result = new Dictionary<string, string[]>();
    foreach (var problem in problems)
    {
      if (result.ContainsKey(problem.Key))
      {
        throw new InvalidEnumArgumentException("Adding multiple problems with the same key is not supported.");
      }
      result.Add(problem.Key, [problem.Value]);
    }

    return TypedResults.ValidationProblem(result);
  }
}
