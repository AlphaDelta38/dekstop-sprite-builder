import * as PIXI from 'pixi.js';
import { Spine } from '@pixi-spine/runtime-4.1';
import extractAnimationsFromJson from './extract-animations-from-json';
import bakeSpineAnimation from './bake-spine-animation';

type returnType = {
  [key: string]: Record<string, File[]>;
}

interface multiBakeSpineAnimationsProps {
  app: PIXI.Application,
  jsons: File[],
  spineSkeletons: Record<string, Spine>,
}

async function multiBakeSpineAnimations({ app, jsons, spineSkeletons }: multiBakeSpineAnimationsProps): Promise<returnType> {
  const resultFiles: returnType = {};

  for (const [key, value] of Object.entries(spineSkeletons)) {
    console.log(key, "key");
    const json = await jsons.find((file: File) => file.name === key)?.text();
    console.log(json, "json");
    const animations = extractAnimationsFromJson(json || "");
    console.log(animations, "animations");
    
    if (!resultFiles[key]) {
      resultFiles[key] = {};
    }

    for (const animation of animations) {
      const animationFiles = await bakeSpineAnimation(app, value, animation);
      resultFiles[key][animation] = animationFiles;
    }
  }

  return resultFiles;
}

export default multiBakeSpineAnimations;
