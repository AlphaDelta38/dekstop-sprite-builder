import * as PIXI from 'pixi.js';
import path from 'path';
import fs from 'fs';
import fsPromises from 'fs/promises';

async function screenSpriteState(sprite: any, renderer: PIXI.IRenderer<PIXI.ICanvas>, filePath: string): Promise<string> {
  const image = await renderer.extract.image(sprite);
  
  const base64Data = image.src.replace(/^data:image\/png;base64,/, "");

  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
  }

  await fsPromises.writeFile(filePath, base64Data, 'base64');

  console.log(`[Screenshot] Saved to: ${filePath}`);
  
  return filePath;
}

export default screenSpriteState;