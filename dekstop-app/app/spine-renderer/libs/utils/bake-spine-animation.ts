import * as PIXI from 'pixi.js';
import { Spine } from 'pixi-spine';
import { createTempFolder } from './create-temp-folder';
import fs from 'fs/promises';
import path from 'path';

export async function bakeSpineAnimation(
  app: PIXI.Application,
  spineObject: Spine,
  animationName: string,
  targetFps: number = 30
): Promise<string> {
  const tempFolder = createTempFolder(`bake-spine-animation[${animationName}]`);
  const tempContainer = new PIXI.Container();
  const originalParent = spineObject.parent;
  
  tempContainer.addChild(spineObject);

  const originalPosition = spineObject.position.clone();
  spineObject.position.set(0, 0);


  spineObject.autoUpdate = false;

	// init pose
  spineObject.skeleton.setToSetupPose();
  spineObject.state.clearTracks();
  
	//set animation
  const trackEntry = spineObject.state.setAnimation(0, animationName, false);
  
	// apply initial state
  spineObject.state.apply(spineObject.skeleton);
  spineObject.skeleton.updateWorldTransform();


  let durationSec = trackEntry.animationEnd > 0 ? trackEntry.animationEnd : 1.0;

  const timeStep = 1 / targetFps;
  const totalFrames = Math.ceil(durationSec * targetFps);

  for (let i = 0; i <= totalFrames; i++) {
    if (i > 0) {
      spineObject.update(timeStep);
    }
    
    const frame = await app.renderer.extract.image(tempContainer);
    const base64Data = frame.src.replace(/^data:image\/png;base64,/, "");

    const frameNum = String(i).padStart(3, '0');
    const fileName = `${animationName}_frame_${frameNum}.png`;

    await fs.writeFile(path.join(tempFolder, fileName), base64Data, 'base64');
  }

  spineObject.autoUpdate = true;
  spineObject.position.copyFrom(originalPosition);

  if (originalParent) {
    originalParent.addChild(spineObject);
  }

  tempContainer.destroy({ children: false });

  return tempFolder;
}

export default bakeSpineAnimation;