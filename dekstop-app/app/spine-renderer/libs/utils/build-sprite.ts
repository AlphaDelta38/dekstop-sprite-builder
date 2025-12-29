import * as PIXI from 'pixi.js';
import fs from 'fs/promises';
import path from 'path';
import { TextureAtlas } from '@pixi-spine/base';
import { getSpineRuntime } from '../helpers/get-spine-runtime';
import { cache, CacheStoreEnum } from '../store/cache-store';


interface BuildSpriteProps {
  atlasPath: string;   
  texturePaths: string[];
  skeletonPath: string;  
}

async function buildSprite({ atlasPath, skeletonPath, texturePaths }: BuildSpriteProps) {
  if (cache.has(CacheStoreEnum.SPINES, skeletonPath)) {
    return cache.get(CacheStoreEnum.SPINES, skeletonPath);
  }

  const atlasContent = await fs.readFile(atlasPath, 'utf8');
  const skeletonContent = await fs.readFile(skeletonPath, 'utf8');
  const skeletonJsonData = JSON.parse(skeletonContent);

  const spineVersion = skeletonJsonData.skeleton.spine || '4.0';
  const majorVersion = spineVersion.split('.').slice(0, 2).join('.'); // "3.8", "4.0", "4.1"

  console.log(`Detected Spine version: ${majorVersion}`);
	
	const runtime = getSpineRuntime(majorVersion) as any;

  if (!runtime) {
      throw new Error(`Unsupported Spine version: ${majorVersion}`);
  }

  const textureMap: Record<string, PIXI.Texture> = {};

  for (const filePath of texturePaths) {
    const texture = cache.get(CacheStoreEnum.TEXTURES, filePath);
	
    if (texture) {
      textureMap[path.basename(filePath)] = texture;
      continue;
    }

    const fileBuffer = await fs.readFile(filePath);
		const base64 = `data:image/png;base64,${fileBuffer.toString('base64')}`;

		const pixiTexture = await PIXI.Texture.fromURL(base64);

		cache.set(CacheStoreEnum.TEXTURES, filePath, pixiTexture);
    textureMap[path.basename(filePath)] = pixiTexture;
  }

  const textureAtlas = new TextureAtlas(atlasContent, (line: string, callback: (t: any) => void) => {
    const texture = textureMap[line];

    if (texture) {
      callback(texture.baseTexture);
    } else {
      console.error(`Texture not found: ${line}`);
      callback(null); 
    }
  });

  const attachmentLoader = new runtime.AtlasAttachmentLoader(textureAtlas);
  const skeletonJsonParser = new runtime.SkeletonJson(attachmentLoader);

  const skeletonData = skeletonJsonParser.readSkeletonData(skeletonJsonData);

  const spine = new runtime.Spine(skeletonData);

  cache.set(CacheStoreEnum.SPINES, skeletonPath, spine);
  return spine;
}

export default buildSprite;