import { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { usePixiView } from "../../context";
import { WORLD_BASIC_SETTINGS } from "../../constants/grid";

interface CenterAxesProps {
  length?: number;
  thickness?: number;
}

export const CenterAxes = ({ length = WORLD_BASIC_SETTINGS.BASIC_WORLD_SIZE, thickness = 2 }: CenterAxesProps) => {
  const { viewport, getCenterPosition } = usePixiView();
  const axesRef = useRef<PIXI.Graphics | null>(null);

  useEffect(() => {
    if (!viewport || axesRef.current) return;

    const { x, y } = getCenterPosition();

    const axes = new PIXI.Graphics();
    axesRef.current = axes;


    axes.lineStyle(thickness, 0xFF3333, 1); 
    axes.moveTo(0,y); 
    axes.lineTo(length, y);

    axes.lineStyle(thickness, 0x33FF33, 1); 
    axes.moveTo(x, 0);
    axes.lineTo(x, length);

    axes.lineStyle(2, 0xFFFFFF, 1);
    axes.beginFill(0x333333, 0.5);
    axes.drawCircle(x, y, 16);
    axes.endFill();


    viewport.addChild(axes);

    return () => {
      if (axesRef.current) {
        viewport.removeChild(axesRef.current);
        axesRef.current.destroy();
        axesRef.current = null;
      }
    };
    
  }, [viewport, length, thickness]);

  return null;
};