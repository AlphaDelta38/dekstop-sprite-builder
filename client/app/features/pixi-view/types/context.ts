import { Dispatch, SetStateAction } from "react";
import * as PIXI from "pixi.js";
import { Spine } from 'pixi-spine';
import { Viewport } from "pixi-viewport";

interface PixiViewContextModel {
  app: PIXI.Application;
  viewport: Viewport;
  spineData: SpineData;
  setSpineData: Dispatch<SetStateAction<SpineData>>;
  getCenterPosition: () => { x: number, y: number };
}

type SpineData = {
  spine: Spine | null;
  animations: string[];
}

export type {
  PixiViewContextModel,
  SpineData,
}