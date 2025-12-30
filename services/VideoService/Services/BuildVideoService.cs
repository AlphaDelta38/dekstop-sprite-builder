using FFMpegCore;
using FFMpegCore.Enums;
using Grpc.Core;

using GrpcBase = VideoService.VideoBuilder.Contract.VideoBuilderService;
using VideoService.VideoBuilder.Contract.Messages;

namespace VideoService.Services;

public class BuildVideoService(ILogger<BuildVideoService> logger) : GrpcBase.VideoBuilderServiceBase
{
  public override async Task<VideoResponse> BuildVideo(VideoRequest request, ServerCallContext context)
  {
    try 
    {
      logger.LogInformation("The video has been generated with that name {Name}", request.OutputName);

		  string sequences_folder_path = await PrepareImagesForFfmpeg(request.FolderPath);
      string outputVideoPath = await GenerateVideoFromImages(
        sequences_folder_path,
        !string.IsNullOrWhiteSpace(request.OutputFolder) ? request.OutputFolder : request.FolderPath,
        request.Format,
        request.FrameRate,
        request.OutputName
      );

      return new VideoResponse
      {
        Success = true,
			  ErrorMessage = "",
        VideoPath = outputVideoPath
      };
    } catch (Exception ex) 
    {
      logger.LogError(ex, "Error occurred while generating video: {Message}", ex.Message);

      return new VideoResponse {
        Success = false,
        ErrorMessage = ex.Message,
        VideoPath = ""
      };
    }
  }


private async Task<string> GenerateVideoFromImages(string inputFolderPath, string outputFolderPath, VideoFormat format, int frameRate, string outputName)
{
    var (ext, codec) = GetCodecByFormat(format);
    string outputVideoPath = Path.Combine(outputFolderPath, outputName + ext);

    await FFMpegArguments.FromFileInput(
      Path.Combine(inputFolderPath, "image_%03d.png"), 
      verifyExists: false, 
      options => options.WithCustomArgument($"-framerate {frameRate}")
    )
    .OutputToFile(outputVideoPath, true, options => options
      .WithVideoCodec(codec)
      .WithConstantRateFactor(18)
      .WithSpeedPreset(Speed.Medium) // set speed preset
      .ForcePixelFormat("yuv420p") // set pixel format
      .OverwriteExisting() // overwrite if exists
      .WithCustomArgument("-vf \"scale=trunc(iw/2)*2:trunc(ih/2)*2\"") // ensure dimensions are even
    ).ProcessAsynchronously();

    logger.LogInformation("Video generated: {Path}", outputVideoPath);

    
    if (!string.IsNullOrWhiteSpace(outputFolderPath))
    {
      clearUpTempDirectory(inputFolderPath);
    }

    return outputVideoPath;
}
  

  private (string, string) GetCodecByFormat(VideoFormat format)
  {
    return format switch
    {
        VideoFormat.Mp4  => (".mp4", "libx264"),      // Standart
        VideoFormat.Mov  => (".mov", "libx264"),      // for Apple/Mac
        VideoFormat.Avi  => (".avi", "libx264"),      // Legacy
        VideoFormat.Webm => (".webm", "libvpx-vp9"),  // Web
        _                => (".mp4", "libx264")       // Base case
    };
  }


	private async Task<string> PrepareImagesForFfmpeg(string FolderPath)
	{
    var workDir = Path.Combine(Path.GetTempPath(), "VideoBuilder_" + Guid.NewGuid());

    Directory.CreateDirectory(workDir);
    logger.LogInformation("Temp dir has been created: {WorkDir}", workDir);

    if (!string.IsNullOrEmpty(FolderPath) && Directory.Exists(FolderPath))
    {
      var sourceFiles = Directory.GetFiles(FolderPath).OrderBy(f => f).ToArray();
      
      for (int i = 0; i < sourceFiles.Length; i++)
      {
        var destFileName = Path.Combine(workDir, $"image_{i + 1:000}.png");
        File.Copy(sourceFiles[i], destFileName);
      }

    } else
    {
      throw new ArgumentException("folder path is invalid.");
    }

    return workDir;
	}

  private void clearUpTempDirectory(string path)
  {
    try 
    {
      if (Directory.Exists(path))
      {
        Directory.Delete(path, true);
        logger.LogInformation("Temp dir has been deleted: {Path}", path);
      }
    } 
    catch (Exception ex) 
    {
      logger.LogWarning(ex, "Failed to delete temp dir: {Path}", path);
    }
  }

}
