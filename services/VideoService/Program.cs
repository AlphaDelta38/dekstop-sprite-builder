
using VideoService.Utils;
using VideoService.Services;
using FFMpegCore;

var builder = WebApplication.CreateBuilder(args);
var ffmpegFolder = FfmpegHelper.ExtractAndGetPath();

GlobalFFOptions.Configure(options =>
{
  options.BinaryFolder = ffmpegFolder;
  options.TemporaryFilesFolder = Path.Combine(Path.GetTempPath(), "VideoService_Processing");
});

Console.WriteLine($"FFmpeg successfully injected: {ffmpegFolder}");

// Add services to the container.
builder.Services.AddGrpcReflection();
builder.Services.AddGrpc();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.MapGrpcReflectionService();
app.MapGrpcService<BuildVideoService>();
app.MapGet("/", () => "Communication with gRPC endpoints must be made through a gRPC client. To learn how to create a client, visit: https://go.microsoft.com/fwlink/?linkid=2086909");

app.Run();
