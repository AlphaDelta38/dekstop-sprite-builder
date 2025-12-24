using System.Reflection;
using System.Runtime.InteropServices;

namespace VideoService.Utils;

public static class FfmpegHelper
{
    public static string ExtractAndGetPath()
    {
        string fileName;
        string resourcePathMiddle;

        if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            fileName = "ffmpeg.exe";
            resourcePathMiddle = "win.ffmpeg.ffmpeg.exe"; 
        }
        else if (RuntimeInformation.IsOSPlatform(OSPlatform.OSX))
        {
            fileName = "ffmpeg";
            resourcePathMiddle = "mac.ffmpeg.ffmpeg"; 
        } else {
            throw new PlatformNotSupportedException("FFmpeg is only supported on Windows and macOS.");
        }


        string tempFolder = Path.Combine(Path.GetTempPath(), "VideoService_FFmpeg");
        Directory.CreateDirectory(tempFolder); 
        string exePath = Path.Combine(tempFolder, fileName);

        if (File.Exists(exePath)) return tempFolder;

        var resourceName = $"VideoService.external_packages.{resourcePathMiddle}";

        
        var assembly = Assembly.GetExecutingAssembly();
        using var stream = assembly.GetManifestResourceStream(resourceName);
        
        if (stream == null)
        {
          var allResources = string.Join("\n", assembly.GetManifestResourceNames());
          throw new Exception($"The resouce don't exist '{resourceName}'.\n Allowed Resources:\n{allResources}");
        }

        using var fileStream = File.Create(exePath);

        stream.CopyTo(fileStream);
            
        
        if (!RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
        {
            try
            {
                File.SetUnixFileMode(exePath, UnixFileMode.UserRead | UnixFileMode.UserWrite | UnixFileMode.UserExecute);
                Console.WriteLine("The rules for unix system have been set successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Warning: Error setting permissions: {ex.Message}");
            }
        }

        Console.WriteLine($"Successfully unpacked: {tempFolder}");

        return tempFolder;
    }
}