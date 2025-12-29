
import { Spine, SkeletonJson, AtlasAttachmentLoader } from '@pixi-spine/runtime-4.1';
import { TextureAtlas } from '@pixi-spine/base';
import * as PIXI from 'pixi.js';

interface BuildSpriteProps {
  atlas: File;   
  textures: File[];
  skeleton: File;  
}

async function buildSprite({ atlas, skeleton, textures }: BuildSpriteProps) {
  const atlasContent = await atlas.text();
  const skeletonContent = await skeleton.text();
  const skeletonJsonData = JSON.parse(skeletonContent);

  // key - texture name
  const textureMap: Record<string, PIXI.Texture> = {};

  for (const file of textures) {
    const blobUrl = URL.createObjectURL(file);

    const pixiTexture = await PIXI.Assets.load({
      src: blobUrl,
      loadParser: 'loadTextures'
    });

    textureMap[file.name] = pixiTexture;
  }
    

  const textureAtlas = new TextureAtlas(atlasContent, (line, callback) => {
    // take texture by name
    const texture = textureMap[line];

    if (texture) {
      callback(texture.baseTexture);
    } else {
      console.error(`Texture not found: ${line}. Is loaded textures:`, Object.keys(textureMap));
      callback(null as any); 
    }
  });


  const attachmentLoader = new AtlasAttachmentLoader(textureAtlas);
  const skeletonJsonParser = new SkeletonJson(attachmentLoader);

  const skeletonData = skeletonJsonParser.readSkeletonData(skeletonJsonData);

  // new sprite from skeleton data
  const spine = new Spine(skeletonData);

  return spine;
}

export default buildSprite;