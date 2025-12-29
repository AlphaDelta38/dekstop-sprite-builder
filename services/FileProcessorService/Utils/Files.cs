
using FileProcessorService.PrepareData.Messages;

namespace FileProcessorService.Utils;

public static class FileUtils
{

  public static IEnumerable<string> GetFilesWithExtension(string folderPath, string extension)
  {
    if (!Directory.Exists(folderPath))
    {
        throw new DirectoryNotFoundException($"The directory '{folderPath}' does not exist.");
    }

   return Directory.EnumerateFiles(folderPath, "*" + extension, SearchOption.AllDirectories);
  }

  public static string FindFileByName(string folderPath, string fileName)
  {
    if (!Directory.Exists(folderPath))
    {
        throw new DirectoryNotFoundException($"The directory '{folderPath}' does not exist.");
    }

    string? foundFile = Directory.EnumerateFiles(folderPath, fileName, SearchOption.AllDirectories)
      .FirstOrDefault();

    if (foundFile == null)
      return string.Empty;

    

    return foundFile;
  }

}