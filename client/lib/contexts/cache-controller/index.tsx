'use client';

import { createContext, useContext, useRef } from "react";
import { CacheControllerModel, CacheDataMap, CacheKey } from "./types";

const CacheControllerContext = createContext<CacheControllerModel | null>(null);

function CacheControllerProvider({ children }: { children: React.ReactNode }) {
  const cache = useRef<Partial<Record<CacheKey, unknown>>>({});

  const getCache = <T extends CacheKey>(key: CacheKey): CacheDataMap[T] | null => {
    return (cache.current[key] ?? null) as CacheDataMap[T] | null ;
  }

  const setCache = <T extends CacheKey>(key: CacheKey, value: CacheDataMap[T]) => {
    cache.current[key] = value;
  }

  const clearCache = (key: CacheKey) => {
    if (!cache.current[key]) return;
    delete cache.current[key];
  }

  const values: CacheControllerModel = {
    getCache,
    setCache,
    clearCache,
  }
  
  return (
    <CacheControllerContext.Provider value={values}>
      {children}
    </CacheControllerContext.Provider>
  )
}


export const useCacheController = () => {
  const context = useContext(CacheControllerContext);

  if (!context) {
    throw new Error("useCacheController must be used within CacheControllerProvider");
  }

  return context;
}

export default CacheControllerProvider;