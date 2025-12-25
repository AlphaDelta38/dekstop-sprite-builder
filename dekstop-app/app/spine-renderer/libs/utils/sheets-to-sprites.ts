
import * as PIXI from 'pixi.js';
import { AtlasSheet } from '../types/entity';


function parseTuple(str?: string): [number, number] {
    if (!str) return [0, 0];
    const parts = str.split(',').map(s => parseInt(s.trim(), 10));
    return [parts[0] || 0, parts[1] || 0];
}

export async function sheetsToSprites(
    app: PIXI.Application, 
    sheets: AtlasSheet[], 
    textures: Record<string, PIXI.BaseTexture>
): Promise<Record<string, File>> {
    const resultFiles: Record<string, File> = {};

    for (const sheet of sheets) {
        const sheetName = sheet.sheetName;
        const baseTexture = textures[sheetName];

        if (!baseTexture) {
            console.warn(`BaseTexture not found: ${sheetName}`);
            continue;
        }

        console.log(`Processing sheet: ${sheetName}, sprites: ${sheet.sprites.length}`);

        for (const spriteData of sheet.sprites) {
            const { info, path } = spriteData;

            const [x, y] = parseTuple(info.xy);
            const [w, h] = parseTuple(info.size);
            const [ox, oy] = parseTuple(info.offset);
            
            const isRotated = info.rotate === 'true';

            const frameW = isRotated ? h : w;
            const frameH = isRotated ? w : h;

            const frame = new PIXI.Rectangle(x, y, frameW, frameH);

            const rotateTag = isRotated ? 6 : 0;
            const orig = new PIXI.Rectangle(ox, oy, w, h);

            const texture = new PIXI.Texture(
                baseTexture,
                frame,
                orig,
                undefined,
                rotateTag
            );

            const sprite = new PIXI.Sprite(texture);
            const canvas = app.renderer.extract.canvas(sprite);


            const file = await new Promise<File | null>((resolve) => {
                if (!canvas?.toBlob) {
                    resolve(null);
                    return;
                }

                canvas.toBlob((blob) => {
                    if (!blob) {
                        resolve(null);
                        return;
                    }

                    const fileName = path.split('/').pop() + '.png';

                    resolve(new File([blob], fileName, { type: 'image/png' }));
                });
            });

            if (file) {
                resultFiles[path] = file;
            }

            sprite.destroy({ children: true, texture: true, baseTexture: false });
        }
    }

    return resultFiles;
}
