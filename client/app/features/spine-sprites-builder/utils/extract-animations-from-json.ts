function extractAnimationsFromJson(json: string): string[] {
  const jsonData = JSON.parse(json);

  if (jsonData["animations"]) {
    const animationNames = Object.keys(jsonData.animations);
    return animationNames;
  }

  return [];
}

export default extractAnimationsFromJson;