using Microsoft.AspNetCore.Mvc;
using Grpc.Core;

using FileProcessorService.PrepareData.Contract.Messages; 

using ClientType = FileProcessorService.PrepareData.Contract.PrepareDataGrpcService.PrepareDataGrpcServiceClient;

namespace ApiGateway.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PrepareController : ControllerBase
{
  private readonly ClientType _client;

  public PrepareController(ClientType client)
  {
    _client = client;
  }

  [HttpPost("basic-structure")]
  public async Task<IActionResult> PrepareBasicStructure([FromBody] PrepareBasicStructureRequest request)
  {
    var reply = await _client.PrepareBasicStructureAsync(request);
    return Ok(reply);
  }
}