import * as spine37 from '@pixi-spine/runtime-3.7';
import * as spine38 from '@pixi-spine/runtime-3.8';
import * as spine41 from '@pixi-spine/runtime-4.1';

export function getSpineRuntime(version: string) {
  const majorVersion = version.substring(0, 3); // "3.7", "3.8", "4.0", "4.1"

  switch (majorVersion) {
    case '3.7':
      return spine37;
    case '3.8':
      return spine38;
    case '4.0':
    case '4.1':
      return spine41;
    default:
      console.warn(`[SpineRuntime] Unknown version ${version}, falling back to 4.1`);
      return spine41;
  }
}