import * as PIXI from 'pixi.js';
import path from 'path';
import buildSprite from "./libs/utils/build-sprite.js";
import screenSpriteState from "./libs/utils/screen-sprite-state.js";
import bakeSpineAnimation from './libs/utils/bake-spine-animation.js';

async function main() {
  try {
    const app = new PIXI.Application({ 
      width: 2048, 
      height: 2048,
      backgroundAlpha: 0
  });
    const basePath = String.raw`C:\Users\kiril\OneDrive\Рабочий стол`;
    const sprite = await buildSprite({
      atlasPath: path.join(basePath, "TPT_spine1.atlas"),
      texturePaths: [
        path.join(basePath, "spine-0.png"),
        path.join(basePath, "spine-1.png"),
        path.join(basePath, "spine-2.png"),
        path.join(basePath, "spine-3.png"),
        path.join(basePath, "spine-4.png"),
        path.join(basePath, "spine-5.png")
      ],
      skeletonPath: path.join(basePath, "sym_M1.json")
    });
    const outputPath = path.join(basePath, "test_screenshot.png");
    const filePath = await screenSpriteState(sprite, app.renderer, outputPath);
    const tempFolder = await bakeSpineAnimation(app, sprite, "idle_loop", 30);
    console.log("Animation baked to:", tempFolder);
    console.log("Screenshot saved to:", filePath);
    
  } catch (error) {
    console.error(error);
  }

}


main();