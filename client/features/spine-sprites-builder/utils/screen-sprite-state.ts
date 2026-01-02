import { Spine } from '@pixi-spine/runtime-4.1';
import * as PIXI from 'pixi.js';

async function screenSpriteState(sprite: Spine, renderer: PIXI.IRenderer, fileName: string): Promise<File | null> {
  const canvas = renderer.extract.canvas(sprite) as HTMLCanvasElement;

  if (!canvas) {
    return null;
  }

  return new Promise<File | null>((resolve) => {
    canvas.toBlob((blob) => {

      if (!blob) {
        resolve(null);
        return;
      }

      resolve(new File([blob], fileName, { type: 'image/png' }));
    });
  });
  
}

export default screenSpriteState;
