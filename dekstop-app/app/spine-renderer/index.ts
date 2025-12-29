import * as PIXI from 'pixi.js';
import fs from 'fs/promises';
import { ipcMain } from 'electron';

const app = new PIXI.Application({ 
  width: 2048, 
  height: 2048,
  backgroundAlpha: 0
})


ipcMain.handle('get-spine-build-data', async (event, data) => {
  const atlas = await fs.readFile(data.atlasPath, 'utf8');
  const skeleton = await fs.readFile(data.skeletonPath, 'utf8');
  const textures = await Promise.all(data.texturePaths.map((path: string) => fs.readFile(path)));
  
  return {
    atlas,
    skeleton,
    textures
  };

});
