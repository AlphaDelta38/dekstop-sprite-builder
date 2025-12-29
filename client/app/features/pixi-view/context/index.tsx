'use client';

import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import * as PIXI from "pixi.js";
import { PixiViewContextModel, SpineData } from "../types/context";
import useOnlyClientRender from "@/app/lib/hooks/use-only-client-render";
import { Viewport } from "pixi-viewport";
import { WORLD_BASIC_SETTINGS } from "../constants/grid";
import buildSprite from "../../spine-sprites-builder/utils/build-sprite";
import { Spine } from "pixi-spine";
import getFileFromDisk from "@/app/lib/utils/get-file-from-disk";

const PixiViewContext = createContext<PixiViewContextModel | null>(null)

export const usePixiView = () => {
  const context = useContext(PixiViewContext);

  if (!context) {
    throw new Error("usePixiView must be used within PixiViewProvider");
  }

  return context;
}

function PixiViewProvider({ children }: { children: React.ReactNode }) {
  const [spineData, setSpineData] = useState<SpineData>({
    spine: null,
    animations: [],
  });
  const appRef = useRef<PIXI.Application | null>(null);
  const viewportRef = useRef<Viewport | null>(null);

  const hasMounted = useOnlyClientRender();

  if (!appRef.current && hasMounted) {
    const initialWidth = window.innerWidth;
    const initialHeight = window.innerHeight;
    const worldSize = WORLD_BASIC_SETTINGS.BASIC_WORLD_SIZE;

    appRef.current = new PIXI.Application({
      width: initialWidth,
      height: initialHeight,
      backgroundAlpha: WORLD_BASIC_SETTINGS.BACKGROUND_COLOR,
    });

    viewportRef.current = new Viewport({
      screenWidth: initialWidth,
      screenHeight: initialHeight,
      worldWidth: worldSize,
      worldHeight: worldSize,
      events: appRef.current.renderer.events
    });

    viewportRef.current.drag({ mouseButtons: 'all' }).pinch().wheel({smooth: 20}).decelerate();
    viewportRef.current.clamp({
      direction: 'all',
      underflow: 'center',
    });
    viewportRef.current.clampZoom({
      minScale: 0.1,
      maxScale: 5,
    });

    appRef.current.stage.addChild(viewportRef.current);
  }

  const getCenterPosition = () => {
    return {
      x: WORLD_BASIC_SETTINGS.BASIC_WORLD_SIZE / 2,
      y: WORLD_BASIC_SETTINGS.BASIC_WORLD_SIZE / 2,
    }
  }

  useEffect(() => {
    return () => {
      appRef.current?.destroy(true, { children: true, texture: true });
      appRef.current = null;
      viewportRef.current = null;
    };
  }, []);


  useEffect(() => {
    const viewport = viewportRef.current;
    const spine = spineData?.spine;

    if (viewport && spine) {
      viewport.addChild(spine);
      
      const { x, y } = getCenterPosition();

      spine.position.set(x, y); 

      viewport.moveCenter(x, y);
      viewport.setZoom(1); 
    }

    return () => {
      if (viewport && spine) {
        viewport.removeChild(spine);
      }
    };
  }, [spineData]);


  const value: PixiViewContextModel = useMemo(() => ({
    app: appRef.current as PIXI.Application,
    viewport: viewportRef.current as Viewport,
    spineData,
    setSpineData,
    getCenterPosition,
  }), [spineData, appRef.current, viewportRef.current]);

  if (!hasMounted) return null;

  return (
    <PixiViewContext.Provider value={value}>
      {children}
    </PixiViewContext.Provider>
  )
}


export default PixiViewProvider;