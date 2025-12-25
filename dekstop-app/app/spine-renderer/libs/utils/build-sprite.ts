import * as PIXI from 'pixi.js';
import fs from 'fs/promises';
import path from 'path';
import { TextureAtlas } from '@pixi-spine/base';
import { getSpineRuntime } from '../helpers/get-spine-runtime';
import { getTextureBase64, setTexture } from '../cache/textures-cache';

interface BuildSpriteProps {
  atlasPath: string;   
  texturePaths: string[];
  skeletonPath: string;  
}

async function buildSprite({ atlasPath, skeletonPath, texturePaths }: BuildSpriteProps) {
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
    const texture = getTextureBase64(filePath);
	
    if (texture) {
      textureMap[path.basename(filePath)] = texture;
      continue;
    }

    const fileBuffer = await fs.readFile(filePath);
		const base64 = `data:image/png;base64,${fileBuffer.toString('base64')}`;

		const pixiTexture = await PIXI.Texture.fromURL(base64);

		setTexture(filePath, pixiTexture);
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

  return spine;
}

export default buildSprite;