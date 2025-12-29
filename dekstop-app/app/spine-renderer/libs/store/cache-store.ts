import { Spine } from "pixi-spine";
import { Texture } from "pixi.js";

enum CacheStoreEnum {
  SPINES = "spines",
  TEXTURES = "textures",
}

interface CacheRegistry {
  [CacheStoreEnum.SPINES]: Spine;
  [CacheStoreEnum.TEXTURES]: Texture;
}

type CacheKey = keyof CacheRegistry;
type CacheValueType<K extends CacheKey> = CacheRegistry[K];
type CacheMap<K extends CacheKey> = Map<string, CacheValueType<K>>;

type CacheStore = {
  [K in CacheKey]: CacheMap<K>;
};

const cacheStore: CacheStore = {
  spines: new Map(),
  textures: new Map(),
};

export const cache = {
  get<K extends CacheKey>(store: K, key: string): CacheValueType<K> | undefined {
    return cacheStore[store].get(key);
  },

  set<K extends CacheKey>(store: K, key: string, value: CacheValueType<K>): void {
    cacheStore[store].set(key, value);
  },

  has<K extends CacheKey>(store: K, key: string): boolean {
    return cacheStore[store].has(key);
  },

  delete<K extends CacheKey>(store: K, key: string): boolean {
    return cacheStore[store].delete(key);
  },

  clear<K extends CacheKey>(store: K): void {
    cacheStore[store].clear();
  },

  clearAll(): void {
    (Object.keys(cacheStore) as CacheKey[]).forEach((key) => {
      cacheStore[key].clear();
    });
  },

} as const;

export { CacheStoreEnum };
export type { CacheRegistry, CacheKey, CacheValueType };
