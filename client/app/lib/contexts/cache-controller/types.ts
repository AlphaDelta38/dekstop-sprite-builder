import { Spine } from "@pixi-spine/runtime-4.1";

export enum CacheKey {
  SPRITE_SPINE_DATA = "spriteSpineData",
  SEQUENCES_DATA = "sequencesData",
}

type CacheDataMap = {
  [CacheKey.SPRITE_SPINE_DATA]: Record<string, Spine>;
  [CacheKey.SEQUENCES_DATA]: Record<string, Record<string, File[]>>;
};

interface CacheControllerModel {
  getCache<K extends CacheKey>(key: K): CacheDataMap[K] | null;
  setCache<K extends CacheKey>(key: K, value: CacheDataMap[K]): void;
  clearCache<K extends CacheKey>(key: K): void;
};

export type { CacheControllerModel, CacheDataMap };