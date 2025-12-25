'use client';

import { useEffect, useRef } from "react";
import { usePixiView } from "../../context";


import styles from "./index.module.scss";

export const PixiScene = () => {
  const parentRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  const { app, viewport, getCenterPosition } = usePixiView();


  useEffect(() => {
    if (!app || !parentRef.current) return;

    const view = app.view as unknown as HTMLCanvasElement;
    parentRef.current.appendChild(view);

    view.style.width = "100%";
    view.style.height = "100%";
    view.style.display = "block";

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        if (width === 0 || height === 0) return;

        app.renderer.resize(width, height);

        if (viewport) {
           viewport.resize(width, height);
        }
        
        if (!isInitialized.current) {
          const { x, y } = getCenterPosition();
          viewport.moveCenter(x, y);
          isInitialized.current = true;
        }

      }
    });

    resizeObserver.observe(parentRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [app]);

  return (
    <div 
      ref={parentRef} 
      className={styles.container}
    />
  );
};

function getCenterPosition(): { x: any; y: any; } {
  throw new Error("Function not implemented.");
}
