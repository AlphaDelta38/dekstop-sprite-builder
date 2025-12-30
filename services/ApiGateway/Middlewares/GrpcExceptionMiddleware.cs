using Grpc.Core;
using System.Net;
using System.Text.Json;

namespace ApiGateway.Middlewares;

public class GrpcExceptionMiddleware
{
  private readonly RequestDelegate _next;
  private readonly ILogger<GrpcExceptionMiddleware> _logger;

  public GrpcExceptionMiddleware(RequestDelegate next, ILogger<GrpcExceptionMiddleware> logger)
  {
    _next = next;
    _logger = logger;
  }

  public async Task InvokeAsync(HttpContext context)
  {
    try
    {
      await _next(context);
    }
    catch (RpcException ex)
    {
      await HandleGrpcExceptionAsync(context, ex);
    }
    catch (Exception ex)
    {
      _logger.LogError(ex, "Unknown error occurred");
      context.Response.StatusCode = 500;
      await context.Response.WriteAsJsonAsync(new { error = "Internal Server Error" });
    }
    }

    private Task HandleGrpcExceptionAsync(HttpContext context, RpcException ex)
    {
      context.Response.ContentType = "application/json";
      
      var statusCode = ex.StatusCode switch
      {
        StatusCode.InvalidArgument => (int)HttpStatusCode.BadRequest, // 400
        StatusCode.NotFound => (int)HttpStatusCode.NotFound,          // 404
        StatusCode.PermissionDenied => (int)HttpStatusCode.Forbidden, // 403
        StatusCode.Unauthenticated => (int)HttpStatusCode.Unauthorized, // 401
        StatusCode.Unavailable => (int)HttpStatusCode.BadGateway,     // 502
        _ => (int)HttpStatusCode.InternalServerError                  // 500
      };

      context.Response.StatusCode = statusCode;

      var response = new 
      { 
        error = MapErrorMessage(ex.StatusCode), 
        details = ex.Status.Detail
      };

      return context.Response.WriteAsJsonAsync(response);
    }


  private string MapErrorMessage(StatusCode code) => code switch
  {
    StatusCode.InvalidArgument => "Invalid Parameters",
    StatusCode.NotFound => "Resource Not Found",
    StatusCode.Unavailable => "Microservice Unavailable",
    _ => "Microservice Error"
  };
}