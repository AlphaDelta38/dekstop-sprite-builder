import { Dispatch, SetStateAction } from "react";
import * as PIXI from "pixi.js";
import { Spine } from 'pixi-spine';
import { Viewport } from "pixi-viewport";

interface PixiViewContextModel {
  app: PIXI.Application;
  viewport: Viewport;
  spineData: SpineData | null;
  setSpineData: Dispatch<SetStateAction<SpineData | null>>;
  getCenterPosition: () => { x: number, y: number };
}

type SpineData = {
  spine: Spine;
  animations: string[];
}

export type {
  PixiViewContextModel,
  SpineData,
}