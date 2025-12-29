
namespace FileProcessorService.Utils;

public class TempFolder
{
  public string Path { get; }

  public TempFolder(string name)
  {
    Path = System.IO.Path.Combine(System.IO.Path.GetTempPath(), name + "_" + Guid.NewGuid().ToString());
    Directory.CreateDirectory(Path);
  }

  public void CleanUp()
  {
    if (Directory.Exists(Path))
    {
      Directory.Delete(Path, true);
    }
  }

  public async Task<string> AddFileFromText(string fileName, string content)
  {
    var filePath = System.IO.Path.Combine(Path, fileName);
    RecursiveCreateDirectory(filePath);
    
    await File.WriteAllTextAsync(filePath, content);
   
    return filePath;
  }

  public string CopyToTempFolder(string fromPath, string to)
  {
    var toFilePath = System.IO.Path.Combine(Path, to);
    RecursiveCreateDirectory(toFilePath);

    if (!File.Exists(fromPath))
    {
      return ""; // File does not exist at source
    }

    File.Copy(fromPath, toFilePath, overwrite: true);

    return toFilePath;
  }
  

  private void RecursiveCreateDirectory(string path)
  {
    var directory = System.IO.Path.GetDirectoryName(path);

    if (directory != null)
    {
      Directory.CreateDirectory(directory);
    }
  }



}
