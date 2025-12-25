// utils/spine-validator.ts


interface SpineSkeletonStructure {
  skeleton: {
      spine?: string;
      hash?: string;
      width?: number;
      height?: number;
      [key: string]: any;
  };
  bones: any[];
  slots: any[];
  skins?: any[];
  animations?: Record<string, any>;
}


function isSpineSkeleton(data: unknown): data is SpineSkeletonStructure {
  let objectToCheck = data;

  if (typeof data === 'string') {
      try {
          objectToCheck = JSON.parse(data);
      } catch (e) {
          return false;
      }
  }

  if (!objectToCheck || typeof objectToCheck !== 'object') {
      return false;
  }

  const skeletonData = objectToCheck as any;

  const hasSkeletonInfo = 'skeleton' in skeletonData && typeof skeletonData.skeleton === 'object';
  const hasBones = 'bones' in skeletonData && Array.isArray(skeletonData.bones) &&skeletonData.bones.length > 0;
  const hasSlots = 'slots' in skeletonData && Array.isArray(skeletonData.slots);

  const hasSpineVersion = hasSkeletonInfo && ('spine' in skeletonData.skeleton || 'hash' in skeletonData.skeleton);

  return hasSkeletonInfo && hasBones && hasSlots && hasSpineVersion;
}

export default isSpineSkeleton;