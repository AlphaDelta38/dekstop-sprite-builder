using Microsoft.AspNetCore.Mvc;
using Grpc.Core;

using VideoService.VideoBuilder.Contract.Messages; 
using ClientType = VideoService.VideoBuilder.Contract.VideoBuilderService.VideoBuilderServiceClient;

namespace ApiGateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VideoBuilderController : ControllerBase
{
  private ClientType _client;   

  public VideoBuilderController(ClientType client)
  {
    _client = client;
  }

  [HttpPost("build-video")]
  public async Task<IActionResult> BuildVideoFromSequences([FromBody] VideoRequest request)
  {
    var reply = await _client.BuildVideoAsync(request);
    return Ok(reply);
  }
}