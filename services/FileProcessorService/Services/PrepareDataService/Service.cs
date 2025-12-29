using Grpc.Core;
using FileProcessorService.PrepareData.Messages;
using FileProcessorService.Services.PrepareDataService.Processors;

using GrpcBase = FileProcessorService.PrepareData.PrepareDataGrpcService;

namespace FileProcessorService.Services;

public class PrepareDataGrpcService(ILogger<PrepareDataGrpcService> logger) : GrpcBase.PrepareDataGrpcServiceBase
{
  public override Task<PrepareBasicStructureReply> PrepareBasicStructure(PrepareBasicStructureRequest request, ServerCallContext context)
  {
    logger.LogInformation("Received PrepareBasicStructure request for folder: {FolderPath}", request.FolderPath);

    return PrepareBasicStructureProcessor.Process(request.FolderPath);
  }

}
