import * as PIXI from 'pixi.js';
import { Spine } from '@pixi-spine/runtime-4.1';

export async function bakeSpineAnimation(
  app: PIXI.Application,
  spineObject: Spine,
  animationName: string,
  targetFps: number = 30
): Promise<File[]> {
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
  const resultFiles: File[] = [];

  for (let i = 0; i <= totalFrames; i++) {
    if (i > 0) {
      spineObject.update(timeStep);
    }
    
    const canvas = app.renderer.extract.canvas(tempContainer);

    const file = await new Promise<File | null>(resolve => {
      if (!canvas?.toBlob) { 
        resolve(null); 
        return; 
      }
      
      canvas.toBlob(blob => {
        if (!blob) { resolve(null); return; }
        
        const frameNum = String(i).padStart(3, '0');
        const fileName = `${animationName}_frame_${frameNum}.png`;
        resolve(new File([blob], fileName, { type: 'image/png' }));
      }, 'image/png');
    });

    if (file) {
      resultFiles.push(file);
    }

    if (i % 5 === 0) await new Promise(r => setTimeout(r, 0));
  }

  spineObject.autoUpdate = true;
  spineObject.position.copyFrom(originalPosition);

  if (originalParent) {
    originalParent.addChild(spineObject);
  }

  tempContainer.destroy({ children: false });

  return resultFiles;
}

export default bakeSpineAnimation;