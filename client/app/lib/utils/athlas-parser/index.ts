import { AtlasSheet, AtlasSprite } from "./types/entity";


export function parseAtlas(atlasData: string): AtlasSheet[] {
  const lines: string[] = atlasData.split('\n');
  
  const sheets: AtlasSheet[] = [];
  
  let currentSheet: AtlasSheet | null = null;
  let currentSprite: AtlasSprite | null = null;

  lines.forEach((line) => {
      const rawLine = line.trimEnd();
      
      if (!rawLine) return;

      const trimmedLine = rawLine.trim();
      
      const isIndented = line.startsWith(' ') || line.startsWith('\t');

      if (isIndented) {
          if (currentSprite && trimmedLine.includes(':')) {
              const splitIndex = trimmedLine.indexOf(':');
              const key = trimmedLine.substring(0, splitIndex).trim();
              const value = trimmedLine.substring(splitIndex + 1).trim();
              
              currentSprite.info[key] = value;
          }
      } else {
          if (trimmedLine.endsWith('.png')) {
              currentSheet = {
                  sheetName: trimmedLine,
                  mainInfo: {},
                  sprites: []
              };
              sheets.push(currentSheet);
              currentSprite = null;
              
          } else if (trimmedLine.includes(':') && currentSheet) {
              const splitIndex = trimmedLine.indexOf(':');
              const key = trimmedLine.substring(0, splitIndex).trim();
              const value = trimmedLine.substring(splitIndex + 1).trim();
              
              currentSheet.mainInfo[key] = value;

          } else if (currentSheet) {
              currentSprite = {
                  path: trimmedLine,
                  info: {}
              };
              currentSheet.sprites.push(currentSprite);
          }
      }
  });

  return sheets;
}

export default parseAtlas;