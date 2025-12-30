using FileProcessorService.PrepareData.Contract;
using VideoService.VideoBuilder.Contract;
using ApiGateway.Middlewares;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddGrpcClient<PrepareDataGrpcService.PrepareDataGrpcServiceClient>(o =>
{
  o.Address = new Uri("http://localhost:5207");
});

builder.Services.AddGrpcClient<VideoBuilderService.VideoBuilderServiceClient>(o =>
{
  o.Address = new Uri("http://localhost:5231");
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseMiddleware<GrpcExceptionMiddleware>();

app.MapControllers();

app.Run();
