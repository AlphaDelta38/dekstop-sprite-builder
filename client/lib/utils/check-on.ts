

function checkOnImage(string: string): boolean {
  const extensions = ['.png', '.jpg', '.jpeg', "webp"];

  const trimmed = string.trim();

  return extensions.some((extension) => trimmed.endsWith(extension));
}

function checkOnSprite(string: string): boolean {
  const trimmed = string.trim();

  return trimmed.includes("/") || (!trimmed.includes(".") && !trimmed.includes(":"));
}


export {
  checkOnImage,
  checkOnSprite,
}