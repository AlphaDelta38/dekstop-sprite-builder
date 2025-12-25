

interface SpriteInfo {
  rotate?: string;
  xy?: string;
  size?: string;
  orig?: string;
  offset?: string;
  index?: string;
  [key: string]: string | undefined;
}

interface AtlasSprite {
  path: string;     
  info: SpriteInfo; 
}

interface SheetMainInfo {
  size?: string;
  format?: string;
  filter?: string;
  repeat?: string;
  [key: string]: string | undefined;
}

interface AtlasSheet {
  sheetName: string;
  mainInfo: SheetMainInfo;
  sprites: AtlasSprite[]; 
}


export type {
  AtlasSheet,
  AtlasSprite,
  SheetMainInfo,
  SpriteInfo,
}
