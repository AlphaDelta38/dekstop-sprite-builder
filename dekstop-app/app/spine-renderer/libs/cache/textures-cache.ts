import { Texture } from "pixi.js";

type TextureCache = {
	[key: string]: Texture;
};

const texturesCache: TextureCache = {

};

export function getTextureBase64(key: string) {
  return texturesCache[key];
}

export function setTexture(key: string, texture: Texture) {
  texturesCache[key] = texture;
}
