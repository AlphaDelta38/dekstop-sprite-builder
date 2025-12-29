using System.IO;
using System.Linq;
using System.Text.Json;

namespace FileProcessorService.Utils;

public static class SpineStructureValidator
{
  public static bool isValidBasicStructure(string filePath)
  {
    try
    {
      using FileStream stream = File.OpenRead(filePath);
      using JsonDocument doc = JsonDocument.Parse(stream);

      JsonElement root = doc.RootElement;

      if (!root.TryGetProperty("skeleton", out _)) 
        return false;


      bool hasBones = root.TryGetProperty("bones", out JsonElement bones) 
        && bones.ValueKind == JsonValueKind.Array 
        && bones.GetArrayLength() > 0;

        
      bool hasAnimations = root.TryGetProperty("animations", out JsonElement anims) 
        && anims.ValueKind == JsonValueKind.Object 
        && anims.EnumerateObject().Any();

      return hasBones || hasAnimations;
    }
    catch
    {
      return false;
    }
  }

}