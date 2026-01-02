'use client';

import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { usePixiView } from "../../context";

interface GridProps {
  size?: number; 
  color?: number;
}

function InfiniteGrid({ size = 100, color = 0x333333 }: GridProps) {
  const { app, viewport, getCenterPosition } = usePixiView();
  const tilingRef = useRef<PIXI.TilingSprite | null>(null);

  useEffect(() => {
    if (!app || !viewport) return;

    const template = new PIXI.Graphics();
    template.lineStyle(1, color, 1)
    template.drawRect(0, 0, size, size);

    const texture = app.renderer.generateTexture(template, {
      resolution: 2, 
      scaleMode: PIXI.SCALE_MODES.NEAREST 
    });

    const bigWidth = 100000; 
    const bigHeight = 100000;

    const tilingSprite = new PIXI.TilingSprite(texture, bigWidth, bigHeight);
    
    const { x, y } = getCenterPosition();

    tilingSprite.anchor.set(0.5);
    tilingSprite.position.set(x, y); 
    
    viewport.addChildAt(tilingSprite, 0);
    tilingRef.current = tilingSprite;

    return () => {
      viewport.removeChild(tilingSprite);
      tilingSprite.destroy();
      texture.destroy();
      template.destroy();
    };
  }, [app, viewport, size, color]);

  return null;
};

export default InfiniteGrid;
