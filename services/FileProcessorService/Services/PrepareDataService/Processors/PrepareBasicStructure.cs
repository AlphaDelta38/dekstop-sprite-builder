using FileProcessorService.Utils;
using FileProcessorService.PrepareData.Contract.Messages;

namespace FileProcessorService.Services.PrepareDataService.Processors;
public static class PrepareBasicStructureProcessor
{
  public static async Task<PrepareBasicStructureReply> Process(string folderPath)
  {
    var tempFolderManager = new TempFolder("preparedBasicStructure");

    string mergedAtlasPath = await PrepareAtlasFiles(folderPath, tempFolderManager);
    List<string> validJsonPaths = PrepareJsonFiles(folderPath, tempFolderManager);

    List<string> requiredTextures = GetRequiredTextures(await File.ReadAllTextAsync(mergedAtlasPath));
    List<string> imagePaths = PrepareImageFiles(folderPath, requiredTextures, tempFolderManager);


    var reply = new PrepareBasicStructureReply
    {
      Success = true,
      Atlas = mergedAtlasPath,
      OutputDirPath = tempFolderManager.Path
    };
        
    reply.Jsons.AddRange(validJsonPaths);
    reply.Images.AddRange(imagePaths);

    return reply;
  }


  private static async Task<string> PrepareAtlasFiles(string folderPath, TempFolder tempFolder)
  {
    var atlasFiles = FileUtils.GetFilesWithExtension(folderPath, ".atlas");
    string mergedContent = "";

    foreach (var filePath in atlasFiles)
    {
      var content = await File.ReadAllTextAsync(filePath);
      mergedContent += content + "\n";
    }

    string outPath = await tempFolder.AddFileFromText("merged.atlas", mergedContent);

    return outPath;
  }

  private static List<string> PrepareJsonFiles(string folderPath, TempFolder tempFolder)
  {
    var jsonFiles = FileUtils.GetFilesWithExtension(folderPath, ".json");
    List<string> validJsonPaths = [];

    foreach (var filePath in jsonFiles)
    {
      if (IsValidBasicStructure(filePath))
      {
        string copiedFilePath = tempFolder.CopyToTempFolder(filePath, Path.Combine("jsons", Path.GetFileName(filePath)));

        if (string.IsNullOrWhiteSpace(copiedFilePath))
          continue;

        validJsonPaths.Add(copiedFilePath);
      }
    }

    return validJsonPaths;
  }

  
  private static List<string> PrepareImageFiles(string folderPath, List<string> requiredTextures, TempFolder tempFolder)
  {
    List<string> imagePaths = [];

    foreach (var textureName in requiredTextures)
    {
      var foundFilePath = FileUtils.FindFileByName(folderPath, textureName);

      if (string.IsNullOrWhiteSpace(foundFilePath))
        continue;

      string copiedFilePath = tempFolder.CopyToTempFolder(foundFilePath, Path.Combine("images", textureName));

      if (string.IsNullOrWhiteSpace(copiedFilePath))
        continue;

      imagePaths.Add(copiedFilePath);
    }

    return imagePaths;
  }


  private static List<string> GetRequiredTextures(string atlasContent)
  {
    string normalizedContent = atlasContent.Replace("\r\n", "\n");
    string[] atlasPages = normalizedContent.Split([ "\n\n" ], StringSplitOptions.RemoveEmptyEntries);
    List<string> textureNames = [];
    
    foreach(var page in atlasPages)
    {
      using StringReader reader = new StringReader(page);
      string? firstLine = reader.ReadLine();

      if (!string.IsNullOrWhiteSpace(firstLine))
      {
        textureNames.Add(firstLine.Trim());
      }
    }   

    return textureNames;
  }

  private static bool IsValidBasicStructure(string filePath)
  {
    return SpineStructureValidator.isValidBasicStructure(filePath);
  }


}
